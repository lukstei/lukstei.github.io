import React from "react"
import { graphql, Link } from "gatsby"
import Img from "gatsby-image"

import Layout from "../components/layout"
import SEO from "../components/seo"
import styled from "@emotion/styled"


const PostData = styled.div`
    && {
        color: #808080;
        font-size: 1.7rem;
    }
    
    a {
        color: rgb(69, 69, 69);       
    }
    a:hover {
        color: black;       
        text-decoration: none;
    }
    
    .author {
        margin-left: 5px;
        font-weight: 600;
    } 
    
    .gatsby-image-wrapper {
        top: 7px;
        border-radius: 12px;
    }
`

const Header = styled.header`
    && {
        margin-bottom: 45px;
    }
`

export default class BlogPostTemplate extends React.Component {
    render() {
        const post = this.props.data.markdownRemark
        const siteTitle = this.props.data.site.siteMetadata.title

        return (
            <Layout location={this.props.location} title={siteTitle}>
                <SEO
                    title={post.frontmatter.title}
                    description={post.frontmatter.description || post.excerpt}
                />
                <article className={`post-content`}>
                    {post.frontmatter.thumbnail && (
                        <div className="post-content-image">
                            <Img
                                className="kg-image"
                                fluid={post.frontmatter.thumbnail.childImageSharp.fluid}
                                alt={post.frontmatter.title}
                            />
                        </div>
                    )}

                    <Header className="post-content-header">
                        <h1 className="post-content-title">{post.frontmatter.title}</h1>

                        <PostData className="post-data">

                            <Link to="/about"> <Img
                                fixed={this.props.data.profileImage.childImageSharp.fixed}
                                alt="Lukas Steinbrecher"
                            />
                                <span className="author">Lukas Steinbrecher</span></Link>,&nbsp;
                            {post.frontmatter.date} · {post.timeToRead} minute read
                        </PostData>
                    </Header>

                    {post.frontmatter.description && (
                        <p className="post-content-excerpt">{post.frontmatter.description}</p>
                    )}

                    <div
                        className="post-content-body"
                        dangerouslySetInnerHTML={{__html: post.html}}
                    />

                    <footer className="post-content-footer">
                        {/* There are two options for how we display the byline/author-info.
        If the post has more than one author, we load a specific template
        from includes/byline-multiple.hbs, otherwise, we just use the
        default byline. */}
                    </footer>
                </article>
            </Layout>
        )
    }
}

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      timeToRead
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        thumbnail {
          childImageSharp {
            fluid(maxWidth: 1360) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
    profileImage: file(
      relativePath: { eq: "profile-pic-small.jpg" }
    ) {
      childImageSharp {
        fixed(width: 27) {
          ...GatsbyImageSharpFixed
        }
      }
    }
  }
`
