import React from "react"
import "./header.css"

import smallProfilePic from '../../content/assets/profile-pic-small.jpg';

import xingIcon from '../../content/assets/icons/xing.svg';
import linkedInIcon from '../../content/assets/icons/linkedin.svg';
import githubIcon from '../../content/assets/icons/github.svg';
import mailIcon from '../../content/assets/icons/mail.svg';


export default function Header() {
    const mSuffix = 'lukstei.com';

    return (
        <header className="header fixed">
            <a className="logoType" href="/about">
                <div className="logo">
                    <img src={smallProfilePic} alt="Lukas Steinbrecher"/>
                </div>
                <div className="type">
                    <h1 className="">lukas steinbrecher</h1>
                </div>
            </a>
            <nav rel="js-menu" className="menu">
                <ul className="itemList">
                    <li className="item">

                        <a className="" data-slug="/posts" href="/posts">
                            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="laptop-code"
                                 role="img"
                                 xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"
                                 className="svg-inline--fa fa-laptop-code fa-w-20 fa-lg">
                                <path fill="currentColor"
                                      d="M255.03 261.65c6.25 6.25 16.38 6.25 22.63 0l11.31-11.31c6.25-6.25 6.25-16.38 0-22.63L253.25 192l35.71-35.72c6.25-6.25 6.25-16.38 0-22.63l-11.31-11.31c-6.25-6.25-16.38-6.25-22.63 0l-58.34 58.34c-6.25 6.25-6.25 16.38 0 22.63l58.35 58.34zm96.01-11.3l11.31 11.31c6.25 6.25 16.38 6.25 22.63 0l58.34-58.34c6.25-6.25 6.25-16.38 0-22.63l-58.34-58.34c-6.25-6.25-16.38-6.25-22.63 0l-11.31 11.31c-6.25 6.25-6.25 16.38 0 22.63L386.75 192l-35.71 35.72c-6.25 6.25-6.25 16.38 0 22.63zM624 416H381.54c-.74 19.81-14.71 32-32.74 32H288c-18.69 0-33.02-17.47-32.77-32H16c-8.8 0-16 7.2-16 16v16c0 35.2 28.8 64 64 64h512c35.2 0 64-28.8 64-64v-16c0-8.8-7.2-16-16-16zM576 48c0-26.4-21.6-48-48-48H112C85.6 0 64 21.6 64 48v336h512V48zm-64 272H128V64h384v256z"
                                      className=""></path>
                            </svg>
                            Posts
                        </a>
                    </li>
                    <li className="item">
                        <a className="" data-slug="/about/" href="/about/">
                            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="user-astronaut"
                                 role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"
                                 className="svg-inline--fa fa-user-astronaut fa-w-14 fa-fw fa-lg">
                                <path fill="currentColor"
                                      d="M64 224h13.5c24.7 56.5 80.9 96 146.5 96s121.8-39.5 146.5-96H384c8.8 0 16-7.2 16-16v-96c0-8.8-7.2-16-16-16h-13.5C345.8 39.5 289.6 0 224 0S102.2 39.5 77.5 96H64c-8.8 0-16 7.2-16 16v96c0 8.8 7.2 16 16 16zm40-88c0-22.1 21.5-40 48-40h144c26.5 0 48 17.9 48 40v24c0 53-43 96-96 96h-48c-53 0-96-43-96-96v-24zm72 72l12-36 36-12-36-12-12-36-12 36-36 12 36 12 12 36zm151.6 113.4C297.7 340.7 262.2 352 224 352s-73.7-11.3-103.6-30.6C52.9 328.5 0 385 0 454.4v9.6c0 26.5 21.5 48 48 48h80v-64c0-17.7 14.3-32 32-32h128c17.7 0 32 14.3 32 32v64h80c26.5 0 48-21.5 48-48v-9.6c0-69.4-52.9-125.9-120.4-133zM272 448c-8.8 0-16 7.2-16 16s7.2 16 16 16 16-7.2 16-16-7.2-16-16-16zm-96 0c-8.8 0-16 7.2-16 16v48h32v-48c0-8.8-7.2-16-16-16z"
                                      className=""></path>
                            </svg>
                            About
                        </a>
                    </li>

                    <li className="item">
                        <div className="icons">
                            <a href="https://github.com/lukstei" target="_blank" rel="noopener noreferrer">
                                <img src={githubIcon}
                                     alt="GitHub lukstei"/></a>
                            <a href="https://www.xing.com/profile/Lukas_Steinbrecher"
                               target="_blank" rel="noopener noreferrer"><img
                                src={xingIcon} alt="XING"/></a><a href="https://at.linkedin.com/in/lukstei"
                                                                  target="_blank" rel="noopener noreferrer"><img
                            src={linkedInIcon}
                            alt="LinkedIn"/></a><a href={`mailto:lukas@${mSuffix}`}><img src={mailIcon} alt="Mail"/></a>
                        </div>
                    </li>
                </ul>
            </nav>
        </header>
    )
}
