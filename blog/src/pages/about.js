import React from "react"
import { graphql, StaticQuery } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

import "../utils/normalize.css"
import "../utils/css/screen.css"
import styled from "@emotion/styled"
import AboutContent from "../components/about-content";

const Header = styled.h1`
    &&& {
        margin-top: 50px;
        text-align: left;
        font-size: 5rem;
    }
`


const AboutPage = ({data}, location) => {

    const siteTitle = data.site.siteMetadata.title

    return (
        <Layout title={siteTitle}>
            <SEO title="About" keywords={[`blog`, `lukas steinbrecher`, `javascript`, `react`]}/>

            <article className={`post-content page-template`}>
                <div className="post-content-body">
                    <Header>About</Header>

                    <AboutContent/>
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
      }
    }
    profileImage: file(
      relativePath: { eq: "profile-pic.jpg" }
    ) {
      childImageSharp {
        fluid(maxWidth: 500) {
          ...GatsbyImageSharpFluid
        }
      }
    }
  }
`

export default props => (
    <StaticQuery
        query={indexQuery}
        render={data => (
            <AboutPage location={props.location} data={data} {...props} />
        )}
    />
)
