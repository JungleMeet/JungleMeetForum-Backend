function htmlEntities(str) {
  return String(str).replace(/&lt;/g, '<');
}

function convertHtmlFormat(arr) {
  const convertArr = arr.map(({ content, ...rest }) => ({
    ...rest,
    content: htmlEntities(content),
  }));

  return convertArr;
}

module.exports = { htmlEntities, convertHtmlFormat };
