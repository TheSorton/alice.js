/* Use Jaro Winkler to search */
import jw from 'jaro-winkler';


export const max = (scoreFunc, array) => {
  let maxScore = null;
  let maxItem = null;
  array.forEach((item, idx) => {
    const score = scoreFunc(item);
    if (maxScore == null || score > maxScore) {
      maxScore = score;
      maxItem = idx;
    }
  });
  return { index: maxItem, score: maxScore };
}

export const bestMatch = (message, args) => {
  const name = args.join(' ')
  var userList = Array.from(message.guild.members.cache.mapValues(user => user.displayName))
  var { index, score } = max(x => jw(x[1], name, {caseSensitive: false}), userList)
  var username = userList[index][1]
  return { username, score };
}

exports = {
  bestMatch,
  max
};