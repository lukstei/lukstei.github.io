import React from "react"
import { graphql, StaticQuery } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import PostCard from "../components/postCard"

import "../utils/normalize.css"
import "../utils/css/screen.css"
import AboutContent from "../components/about-content";

import styled from "@emotion/styled"

const Main = styled.div`
    &&& {
        width: 100%;
        display: flex;
    }
    
    @media (max-width: 1024px) {
        display: block!important;
        
        .about {
            min-width: 0px!important;
        }
    }
    
    .about {
        max-width: 600px;
        min-width: 600px;
    }
    
    .post-feed {
        display: block;
    }
`

const Posts = styled.div`
    &&& {
        margin-left: 20px;
    }
    
    h2 {
        margin: 30px 0;
    }   
`

const BlogIndex = ({data}, location) => {
    const siteTitle = data.site.siteMetadata.title
    const posts = data.allMarkdownRemark.edges
    let postCounter = 0

    return (
        <Layout hideHeader={true} title={siteTitle}>
            <SEO
                title="All posts"
                keywords={[`blog`, `gatsby`, `javascript`, `react`]}
            />

            <Main>
                <div className="about">
                    <AboutContent/>
                </div>

                <Posts>
                    <h2>Posts</h2>
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
                </Posts>
            </Main>
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
            <BlogIndex location={props.location} props data={data} {...props} />
        )}
    />
)
