// -*- coding: utf-8; -*-
/*
 * Message Reaction Trackers
 *
 * These keep track of messages whose reactions need to be watched. This
 * could be used, for example, to scroll an image whenever an :arrow_right:
 * reaction is added / removed.
 *
 * Since you might have multiple commands whose messages' reactions should
 * be watched, each message is given a ``type''. Each command should
 * (generally) use its own type. Some basic types have been added to the 
 * enum MessageType, but any string is allowed.
 *
 *--------------------------------------------------------------------------
 * Setup
 *--------------------------------------------------------------------------
 * Before tracking a message, the message's type needs to be registered.
 * To register it, you will need
 *   1. A message type
 *   2. A validator (of type PreMessageValidator, see types below)
 *
 * A validator is some code which verifies that a reaction has been
 * applied to a tracked message. To do this, it receives
 *   1. A record of some information stored when the message was tracked
 *   2. The message the reaction was applied to
 * From this, the validator must return `true` if the record and the message
 * match.
 *
 * Some basic validators have been created already, see `default_validator`
 * and `validators`. Validators may be combined with `combine_validators`.
 *
 * Finally, to register a validator, use `register_message_type`.
 *
 * Example Setup:
 * ```js
 * register_message_type('foo') // This uses the default validator
 * 
 * // Custom validator usage
 * // This tracks reactions for every message in the given channel
 * register_message_type('bar', validator=(record, msg) => {
 *     return record.channel_id == '45848465424324' ;
 * });
 * ```
 *
 *--------------------------------------------------------------------------
 * Usage
 *--------------------------------------------------------------------------
 * To track a message, use `track_message`. To check if a message has been
 * tracked, use `is_message_tracked`. Both of these accept the message type
 * to check for as an argument.
 *
 * Example Usage:
 * ```js
 * message.send().then(msg => track_message('foo', msg));
 * 
 * client.on('messageReactionAdd', async (reaction, user) => {
 *     /// ...
 *     if (is_message_tracked('foo', reaction.message)) {
 *         // do stuff
 *     }
 * });
 * ```
 */

const reaction_threshold = 1000*60*1; // 1 minute

const MessageType = { // enum; values should all be of type string or int
  Image: '%image',
  Role: '%role',
  YouTube: '%yt'
};

const record_store = { // of type RecordStore
  channels:   {},
  validators: {}
}

//--------------------------------------------------------------------------
// Datatypes

/*
 * interface TrackRecord {
 *     type: string,
 *     message_id: Snowflake,
 *     channel_id: Snowflake,
 *     timestamp: number, // Time
 *     [extra_data: string]: Any
 * }
 * 
 * interface PreMessageValidator {
 *     (TrackRecord, Message): Boolean
 * }
 * 
 * interface MessageValidator extends PreMessageValidator {
 *     type: string
 * }
 * 
 * interface RecordStore {
 *     channels: {
 *         [channel_id: Snowflake]: {
 *             [message_type: string]: TrackRecord
 *         }
 *     },
 *     validators: {
 *         [message_type: string]: MessageValidator
 *     }
 * }
 */

/// TrackRecord :: (string, Message, extra_data=Object) -> TrackRecord
///
/// Constructor for TrackRecord type.
///
/// @param type        Message type
/// @param msg         Message whose reactions should be tracked
/// @param extra_data  Extra data for custom TrackRecords
/// @returns  A new TrackRecord
const TrackRecord = (type, msg, extra_data={}) => ({
  type,
  message_id: msg.id,
  channel_id: msg.channel.id,
  timestamp:  msg.createdTimestamp,
  ...extra_data
});

/// MessageValidator :: (string, PreMessageValidator) -> MessageValidator
///
/// Constructor for MessageValidator type.
///
/// @param type  Message type
/// @param fn    Validation code. WARN: `fn.type` field is mutated
/// @returns  A new MessageValidator
const MessageValidator = (type, fn) => {
  fn.type = type;
  return fn;
};

//--------------------------------------------------------------------------
// Internals

/// Store Record :: TrackRecord -> Void
///
/// Stores a TrackRecord into the global RecordStore.
const store_record = record => {
  const nu = {};
  nu[record.type] = record;
  const old = record_store.channels[record.channel_id];
  record_store.channels[record.channel_id] = Object.assign({}, old, nu);
};

/// Retrieve Record :: (string, Snowflake) -> Maybe<TrackRecord>
///
/// Retrieves the record corresponding with a particular message from the
/// global RecordStore.
const retrieve_record = (type, msg) => {
  if (msg.channel.id in record_store.channels) {
    const c = record_store.channels[msg.channel.id];
    if (type in c) {
      return c[type];
    }
  }
  return null;
};

/// Store Validator :: MessageValidator -> Void
///
/// Stores a MessageValidator into the global RecordStore.
const store_validator = validator => {
  record_store.validators[validator.type] = validator;
};

/// Retrieve Message Validator :: string -> Maybe<MessageValidator>
///
/// Retrieves the MessageValidator associated with a particular MessageType.
const retrieve_validator = type => {
  if (type in record_store.validators) {
    return record_store.validators[type];
  }
  return null;
};

//--------------------------------------------------------------------------
// (Pre)MessageValidators
// These can be composed to form a new MessageValidator.

/// This object contains many built-in PreMessageValidators. These can be
/// combined to create more specific PreMessageValidators.
const validators = {
  /// This MessageValidator always returns valid (true) 
  true: (record, msg) => true,
  /// This MessageValidator returns valid if the message is the one
  /// recorded in `record`
  base: (record, msg) => msg.id === record.message_id,
  /// This field is curried. Its type is number -> PreMessageValidator.
  ///
  /// This validator ensures that not too much time has passed since the
  /// message recorded was created.
  ///
  /// @param threshold  Amount of time in milliseconds that the validator
  ///                   is active for.
  /// @returns  PreMessageValidator which checks the above condition
  within_time: threshold => (record, msg) => {
    const now = new Date().getTime();
    return Math.abs(record.timestamp - now) < threshold;
  }
};

/// Combine Validators :: Array<PreMessageValidator> -> PreMessageValidator
///
/// Combine multiple validators into a single validators, which verifies
/// that a given (record, message) tuple is valid for each validator.
///
/// In other words, if any validator returns false, the entire validator
/// also returns false.
///
/// @param validators  List of PreMessageValidator's
/// @returns  PreMessageValidator as per above
const combine_validators = validators => {
  // if only one validator is given, just handle that sensibly
  if (!Array.isArray(validators)) return validators;

  return (record, msg) => {
    for (let i = 0; i < validators.length; ++i) {
      if (!validators[i](record, msg)) return false;
    }
    return true;
  };
};

const default_validator = combine_validators([
  validators.base,
  validators.within_time(reaction_threshold)
]);

/// Register Message Type
///  :: (string, validator=Array<PreMessageValidator>) -> Void
///
/// Registers a PreMessageValidator with the given Message Type.
///
/// A MessageValidator is not needed as argument, this function will handle
/// the PreMessageValidator -> MessageValidator transform.
///
/// @param type       Message type validator is supposed to check
/// @param validator  PreMessageValidator or an array of such to combine
///                   for checking messages of `type`.
const register_message_type = (type, validator=default_validator) => {
  store_validator(MessageValidator(type, combine_validators(validator)));
};

//--------------------------------------------------------------------------
// Message Tracking

/// Track Message :: (string, Message) -> Void
///
/// Register a message for reaction tracking.
///
/// @param type  Type of Message for `msg`
/// @param msg   Message to track reactions for
const track_message = (type, msg) => {
  const rec = TrackRecord(type, msg);
  store_record(rec);
  return rec;
};

/// Is Message Tracked? :: (string, Message) -> Boolean
///
/// Determine if a Message is tracked as a `type`.
///
/// @param type  Type of Message to check tracking for
/// @param msg   Message to check tracking on
/// @returns  True if message is tracked with that `type`. False o.w.
const is_message_tracked = (type, msg) => {
  const rec = retrieve_record(type, msg);
  const valid = retrieve_validator(type);
  if (!rec) return false;
  if (!valid) return false;
  return valid(rec, msg);
};

//--------------------------------------------------------------------------
// Exports

register_message_type(MessageType.Image);
register_message_type(MessageType.Role, validator=validators.base);
register_message_type(MessageType.YouTube);

exports.reaction_tracking = {
  // magic stuff
  MessageType,
  reaction_threshold,
  // normal use stuff
  track_message,
  is_message_tracked,
  // setup stuff
  register_message_type,
  default_validator,
  combine_validators,
  validators
};

