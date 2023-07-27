/* Use Jaro Winkler to search */
import jw from "jaro-winkler";

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
};

export const bestMatch = (message, args) => {
  const name = args.join(" ");
  const userList = Array.from(
    message.guild.members.cache.mapValues((user) => user.displayName)
  );
  const { index, score } = max(
    (x) => jw(x[1], name, { caseSensitive: false }),
    userList
  );
  const username = userList[index][1];
  return { username, score };
};

exports = {
  bestMatch,
  max,
};
