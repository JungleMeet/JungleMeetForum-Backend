const discussionListData = (data) => {
  const {
    _id,
    title,
    content,
    createdAt,
    bgImg,
    hashtag,
    hashtags,
    author,
    like,
    viewNumber,
    commentCount,
  } = data;
  const date = new Date(createdAt);

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  const amOrPm = hour > 12 ? 'PM' : 'AM';
  const releaseDateRightFormat = `${day}/${month}/${year} ${hour}:${minute} ${amOrPm}`;

  const likeCount = like.length;

  return {
    _id,
    title,
    content,
    releaseDateRightFormat,
    hashtag,
    hashtags,
    bgImg,
    author,
    likeCount,
    viewNumber,
    commentCount,
  };
};

const processPostSearchResult = (post) => {
  const { content, bgImg, releaseDateRightFormat, ...rest } = discussionListData(post);
  return { ...rest, createdAt: releaseDateRightFormat };
};

module.exports = {
  discussionListData,
  processPostSearchResult,
};
