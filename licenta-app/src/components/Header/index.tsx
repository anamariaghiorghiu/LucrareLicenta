import React, { useEffect, useState } from "react";
import { BiPaint } from "react-icons/bi";
import { RiFilePaper2Line } from "react-icons/ri";
import { HiLogout } from "react-icons/hi";
import { signIn, useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { trpc } from "../../utils/trpc";
import { BsFillSuitHeartFill } from "react-icons/bs";

const Header = () => {
  const { data: session } = useSession();
  const currentUser = session?.user?.id;

  const getUsername = trpc.user.getUserProfileById.useQuery({
    id: currentUser as string,
  });

  const username = getUsername.data?.username;
  const [showMore, setShowMore] = useState(true); 
  
  const [showPaintOn, setShowPaintOn] = useState(true);
  const [showMyPaintingsOn, setShowMyPaintingsOn] = useState(true);
  const [showLogOutOn, setShowLogOutOn] = useState(true);

  const makeShowSectionTrue = () => {
    setShowPaintOn(true);
    setShowMyPaintingsOn(true);
    setShowLogOutOn(true);
  };

  useEffect(() => {
    makeShowSectionTrue();
  }, []);

  return (
    <>
      <header
        className="flex h-20 w-full flex-row items-center justify-center border border-gray-200
            bg-white px-4 "
        style={{ fontFamily: "'Abril Fatface', cursive" }}
      >
        <div className="absolute right-4 flex items-center space-x-4">
          {session ? (
            <>
              <div className="flex cursor-pointer text-lg text-orange-400 ">
                <BsFillSuitHeartFill className="h-8 w-8 pr-2 text-orange-400" />
                <div className="">
                  Hello @
                  <Link href={`/user/${username}`}>
                    {session?.user?.name}
                  </Link>
                  !
                </div>
                <div className=""></div>
              </div>
              {!showMore && (
                <div className="border-2 border-orange-400 p-4 rounded-md bg-gray-100 shadow-lg">
                    <h1 className="text-orange-500 text-2xl font-bold mb-2">Can't render the username</h1>
                    <p className="text-gray-700 text-xl">No username</p>
                </div>
            )}

              {showPaintOn ? (
                <Link href={`/paint`} className="text-orange-400">
                  <button
                    className="flex items-center space-x-3 rounded 
                            border px-4 py-2 transition hover:border-orange-400"
                  >
                    <div>
                      <BiPaint />
                    </div>
                    <div>Paint</div>
                  </button>
                </Link>
              ) : (
                <div>Can't render Paint</div>
              )}

              {showMyPaintingsOn ? (
                <Link href={`/mypaintings`} className="text-orange-400">
                  <button
                    className="flex items-center space-x-3 rounded 
                            border px-4 py-2 transition hover:border-orange-400"
                  >
                    <div>
                      <RiFilePaper2Line />
                    </div>
                    <div>My Paintings</div>
                  </button>
                </Link>
              ) : (
                <div>Can't render MyPaintings</div>
              )}

              {showLogOutOn ? (
                <div className="text-orange-400">
                  <button
                    onClick={() => signOut()}
                    className="flex items-center space-x-3 rounded 
                            border px-4 py-2 transition hover:border-orange-400"
                  >
                    <div>
                      <HiLogout />
                    </div>
                    <div>Log Out</div>
                  </button>
                </div>
              ) : (
                <div>Can't render Log Out</div>
                
              )}
            </>
          ) : (
            <div>
              <button
                onClick={() => signIn()}
                className="flex items-center space-x-3 rounded 
                        border px-4 py-2 transition hover:border-orange-400"
              >
                Sign In
              </button>
            </div>
          )}
        </div>
        <Link
          href={"/"}
          className="cursor-pointer select-none text-5xl font-thin text-orange-400"
        >
          BlankCanva
        </Link>
        {!showMore && (
                <div className="border-2 border-orange-400 p-4 rounded-md bg-gray-100 shadow-lg">
                    <h1 className="text-orange-500 text-2xl font-bold mb-2">Can't render header</h1>
                </div>
            )}
      </header>
    </>
  );
};

export default Header;
