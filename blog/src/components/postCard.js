import React from "react"
import { Link } from "gatsby"
import styled from "@emotion/styled"

const Post = styled.div`
    .date {
        font-weight: 700;
        text-transform: uppercase;
    }
    
    .post {
        color: rgb(69, 69, 69);
        font-size: 3rem;
        font-weight: 700;
    }
    
    .post:hover {
        color: black;
    }
`

export default props => (
    <Post>
        <div className="date">{props.node.frontmatter.date}</div>
        <Link to={props.node.fields.slug} className="post">
            {props.node.frontmatter.title}
        </Link>
    </Post>
)
