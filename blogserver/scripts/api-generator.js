hexo.extend.generator.register('api', function (locals) {
    // Extract blog post metadata
    const posts = locals.posts.map(post => ({
      title: post.title,
      slug: post.slug,
      date: post.date,
      updated: post.updated,
      excerpt: post.excerpt,
      url: post.permalink,
    }));
  
    return {
      path: 'api/posts.json', // API endpoint
      data: JSON.stringify(posts, null, 2),
    };
  });
  