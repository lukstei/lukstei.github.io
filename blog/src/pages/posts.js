import React from "react"
import { graphql, StaticQuery } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import PostCard from "../components/postCard"

import "../utils/normalize.css"
import "../utils/css/screen.css"


const Posts = ({data}, location) => {
    const siteTitle = data.site.siteMetadata.title
    const posts = data.allMarkdownRemark.edges
    let postCounter = 0

    return (
        <Layout title={siteTitle}>
            <SEO
                title="All posts"
                keywords={[`blog`, `gatsby`, `javascript`, `react`]}
            />

            <article className={`post-content`}>
                <div
                    className="post-content-body"
                >
                    <h1 style={{margin: "30px auto"}}>Posts</h1>
                    {posts.map(({node}) => {
                        postCounter++
                        return (
                            <PostCard
                                key={node.fields.slug}
                                count={postCounter}
                                node={node}
                                postClass={`post`}
                            />
                        )
                    })}
                </div>
            </article>
        </Layout>
    )
}

const indexQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        description
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM, YYYY")
            title
          }
        }
      }
    }
  }
`

export default props => (
    <StaticQuery
        query={indexQuery}
        render={data => (
            <Posts location={props.location} props data={data} {...props} />
        )}
    />
)
