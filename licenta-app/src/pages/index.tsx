import React from "react";
import MainLayout from "../layouts/MainLayout";
import { useSession } from "next-auth/react";
import Image from "next/image";
import WriteFormModal from "../components/WriteFormModal";
import MainSection from "../components/MainSection";
import SideSection from "../components/SideSection";

const HomePage = () => {
  const { status } = useSession();
  const showSection = true;
  return (
    <>
      {showSection && (
        <MainLayout>
          {status === "authenticated" ? (
            <section className="grid grid-cols-12">
              <></>
              <MainSection />
              <SideSection />
            </section>
          ) : (
            <div className="App">
              <div className="page-content">
                <div className="left-column">
                  <div className="title">BlankCanva</div>
                  <div className="slogan">
                    whether you need a place to brainstorm,
                    <br />
                    sketch out ideas or create art,
                    <span className="blankcanva"> BlankCanva.</span>
                  </div>
                  <div className="aboutUsContent">
                    <div className="aboutUsTitle">
                      What is <span className="blankcanva">BlankCanva</span> ?
                    </div>
                    <div className="aboutUsContent">
                      Welcome to our website! Our web app is designed to inspire
                      and empower you to unleash your artistic talents and
                      create beautiful works of art. <br />{" "}
                      <div className="separator">*</div>
                      We understand the importance of having a platform that is
                      user-friendly and intuitive, which is why we have put in
                      countless hours of research and development to create an
                      app that is both easy to use and fun. <br />{" "}
                      <div className="separator">*</div>
                      We are thrilled to share our passion for web design with
                      you, and we hope that our app will help you explore and
                      express your creativity in new and exciting ways. One of
                      the unique features of our web app is the ability to
                      easily share your creations with others. Whether it's
                      sharing with friends, family, or a wider audience, our
                      platform allows you to showcase your work and receive
                      feedback from others.
                      <br /> <div className="separator">*</div>
                      Thank you for choosing our platform, and we can't wait to
                      see the amazing things you will create! <br />
                    </div>
                  </div>
                </div>
                <div className="right-column">
                  <div className="decoration h-full">
                    <Image
                      src="/images/deco.png"
                      width={800}
                      height={800}
                      alt="decorations"
                    />
                  </div>
                  <div className="terms">
                    <Image
                      src="/images/terms.png"
                      width={500}
                      height={500}
                      alt="terms"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          <WriteFormModal />
        </MainLayout>
      )}
    </>
  );
};

export default HomePage;
