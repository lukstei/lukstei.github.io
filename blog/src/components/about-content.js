import React from "react"
import { graphql, StaticQuery } from "gatsby"
import Img from "gatsby-image"

import "../utils/normalize.css"
import "../utils/css/screen.css"
import styled from "@emotion/styled"


import xingIcon from '../../content/assets/icons/xing.svg';
import linkedInIcon from '../../content/assets/icons/linkedin.svg';
import githubIcon from '../../content/assets/icons/github.svg';
import mailIcon from '../../content/assets/icons/mail.svg';


const About = styled.div`
    .kg-image {
        width: 400px!important;
        height: 400px!important;
        max-width: 100%;
        max-height: 100%;
    }
    
    @media (max-width: 650px) {
        .kg-image {
            width: 250px!important;
            height: 250px!important;
            max-width: 100%;
            max-height: 100%;
        }
    }
`

const Icons = styled.ul`
    && {
        list-style: none; 
        justify-content: center;
        overflow: hidden;
        display: flex;
    }
    
    li {
      float: left;
    }
    
    li a {
      display: block;
      color: white;
      text-align: center;
      padding: 16px;
      text-decoration: none;
    }
    
    li a:hover {
      background-color: #cbeafb;
    }
    
    img {
        width: 50px;
    }
`

export default function AboutContent() {
    const mSuffix = 'lukstei.com';

    return <StaticQuery
        query={graphql`
  query {
    profileImage: file(
      relativePath: { eq: "profile-pic.jpg" }
    ) {
      childImageSharp {
        fixed(width: 500) {
          ...GatsbyImageSharpFixed
        }
      }
    }
  }
`}
        render={data => (
            <About>
                <Img style={{display: "block", borderRadius: 20, margin: "40px auto"}}
                     className="kg-image"
                     fixed={data.profileImage.childImageSharp.fixed}
                     alt={"Lukas Steinbrecher"}
                />

                <p>Welcome! My name is Lukas Steinbrecher and this is my personal blog where I write about techie
                    stuff. I'm based in Vienna <span role="img" aria-label="austria">🇦🇹</span>.</p>

                <p>I am a passionate Software Engineer <span role="img" aria-label="software engineer">👨🏼‍💻</span>, currently consulting financial institutions at <a
                    href="https://senacor.com" target="_blank" rel="noopener noreferrer">Senacor</a>. </p>
                <p>If you just want to say hello or ask a question, send me a short message <span role="img" aria-label="letter">💌</span>. I am always
                    eager to make new connections.</p>

                <Icons>
                    <li><a href="https://github.com/lukstei" target="_blank" rel="noopener noreferrer"><img
                        src={githubIcon}
                        alt="GitHub lukstei"/></a></li>
                    <li><a href="https://www.xing.com/profile/Lukas_Steinbrecher" target="_blank"
                           rel="noopener noreferrer"><img
                        src={xingIcon} alt="XING"/></a></li>
                    <li><a href="https://at.linkedin.com/in/lukstei" target="_blank" rel="noopener noreferrer"><img
                        src={linkedInIcon}
                        alt="LinkedIn"/></a></li>
                    <li><a href={`mailto:lukas@${mSuffix}`}><img src={mailIcon} alt="Mail"/></a></li>
                </Icons>
            </About>
        )}
    />;
}