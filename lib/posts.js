import fs from "fs";
import path from "path";
import matter from "gray-matter";
import remark from "remark";
import html from "remark-html";

const postsDirectory = path.join(process.cwd(), "posts");

const removeExtension = (fileName) => fileName.replace(/\.md$/, "");

export const getSortedPostsData = () => {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostData = fileNames.map((fileName) => {
    const id = removeExtension(fileName);
    const fullPath = path.join(postsDirectory, fileName);
    const fullContent = fs.readFileSync(fullPath, "utf8");
    const matterResults = matter(fullContent);

    return { id, ...matterResults.data };
  });

  return allPostData.sort((a, b) => a.date - b.date);
};

export const getAllPostIds = () =>
  fs.readdirSync(postsDirectory).map((fileName) => ({
    params: {
      id: removeExtension(fileName),
    },
  }));

export const getPostById = async (id) => {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContent = fs.readFileSync(fullPath, "utf8");

  const matterResults = matter(fileContent);

  const processedContent = await remark()
    .use(html)
    .process(matterResults.content);

  return {
    id,
    contentHtml: processedContent.toString(),
    ...matterResults.data,
  };
};
