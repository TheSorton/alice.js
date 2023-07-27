export const mongoSchema = {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["username", "userID", "lastUpdated"],
      properties: {
        lastUpdated: {
          bsonType: "date",
          description: "must be a date and is required",
        },
        username: {
          bsonType: "string",
          description: "must be a string and is required",
        },
        userID: {
          bsonType: "number",
          description: "must be a string and is required",
        },
        created: {
          bsonType: "date",
          description: "must be a date and is required",
        },
        lastfmName: {
          bsonType: "string",
          description: "must be a string and is required",
        },
      },
    },
  },
};
