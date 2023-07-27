export const htmlToMarkdown = (html) => {
  // Convert <h1> - <h6> tags to Markdown headers
  html = html.replace(/<h([1-6])>(.*?)<\/h\1>/g, "#$1 $2\n");

  // Convert <strong> and <b> tags to Markdown bold
  html = html.replace(/<(strong|b)>(.*?)<\/\1>/g, "**$2**");

  // Convert <em> and <i> tags to Markdown italic
  html = html.replace(/<(em|i)>(.*?)<\/\1>/g, "*$2*");

  // Convert <a> tags to Markdown links
  html = html.replace(/<a href="(.*?)">(.*?)<\/a>/g, "[$2]($1)");

  // Convert <ul> and <ol> tags to Markdown lists
  html = html.replace(/<ul>(.*?)<\/ul>/gms, (match) => {
    let items = match.match(/<li>(.*?)<\/li>/gms);
    items = items.map((item) => item.replace(/<li>(.*?)<\/li>/g, "- $1\n"));
    return items.join("");
  });
  html = html.replace(/<ol>(.*?)<\/ol>/gms, (match) => {
    let items = match.match(/<li>(.*?)<\/li>/gms);
    const index = 1;
    items = items.map((item) =>
      item.replace(/<li>(.*?)<\/li>/g, `${index}. $1\n`)
    );
    return items.join("");
  });

  // Convert <code> and <pre> tags to Markdown code blocks
  html = html.replace(/<pre>(.*?)<\/pre>/gms, "```\n$1\n```");
  html = html.replace(/<code>(.*?)<\/code>/g, "`$1`");

  // Remove all other HTML tags
  html = html.replace(/<\/?[^>]+>/g, "");

  return html;
};

exports.html2md = {
  htmlToMarkdown,
};
