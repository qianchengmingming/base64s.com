import { PostStatus, findPostBySlug } from "@/models/post";

import BlogDetail from "@/components/blocks/blog-detail";
import Empty from "@/components/blocks/empty";
import { Post } from "@/types/post";

// 详细注释：generateMetadata 和页面组件 props 的参数类型应为 { params: { locale: string; slug: string } }，不能为 Promise，否则会导致类型冲突。
export async function generateMetadata({ params }: { params: { locale: string; slug: string } }) {
  const { locale, slug } = params;
  const post = await findPostBySlug(slug, locale);
  let canonicalUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/posts/${slug}`;
  if (locale !== "en") {
    canonicalUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/${locale}/posts/${slug}`;
  }
  return {
    title: post?.title,
    description: post?.description,
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function ({ params }: { params: { locale: string; slug: string } }) {
  const { locale, slug } = params;
  const post = await findPostBySlug(slug, locale);
  if (!post || post.status !== PostStatus.Online) {
    return <Empty message="Post not found" />;
  }
  return <BlogDetail post={post as unknown as Post} />;
}
