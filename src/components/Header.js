import React from "react";
import { auth } from "../utils/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { addUsers, removeUser } from "../utils/userslice";
import { NetflixURL } from "../utils/constant";
import { toggleGptSearchView } from "../utils/gptSlice";
import "./header.css";
const Header = () => {
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const gptsearch = useSelector((store) => store.gpt.showGptSearch);
  const HandleSignOut = () => {
    signOut(auth)
      .then(() => {})
      .catch((error) => {
        navigate("/error");
      });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const { uid, email, displayName, photoURL } = user;
        dispatch(
          addUsers({
            uid: uid,
            email: email,
            displayName: displayName,
            photoURL: photoURL,
          })
        );
        navigate("/browse");
      } else {
        dispatch(removeUser());
        navigate("/");
      }
    });
    return () => unsubscribe();
  }, []);

  const [showMenu, setShowMenu] = useState(false);
  function showMenuHandler() {
    setShowMenu(!showMenu);
  }

  const handleGPT = () => {
    dispatch(toggleGptSearchView());
  };
  return (
    <div
      className={`absolute w-[100%] md:flex md:h-24 justify-between bg-gradient-to-b from-black z-30 font-bold`}
    >
      <div className=" px-8 md:py-2 bg-gradient-to-b from-black ">
        <img className=" w-[175px] md:w-60" src={NetflixURL} alt="" srcset="" />
      </div>
      {user && (
        <div className="flex nav ">
          <div
            className="absolute top-2 right-4 w-[40px] flex-col justify-between z-10 flex object-none menu"
            onClick={showMenuHandler}
          >
            <span className="h-[6px] bg-white w-[100%] m-[2px] "></span>
            <span className="h-[6px] bg-white w-[100%] m-[2px]"></span>
            <span className="h-[6px] bg-white w-[100%] m-[2px]"></span>
          </div>
          <div
            className={`list-none flex-row header ${
              showMenu ? "openkijiye" : ""
            }`}
          >
            <div className="flex justify-between mx-2 my-4">

            <button
              onClick={handleGPT}
              className="bg-green-500 w-[100px] md:mx-4 md:my-auto p-2 rounded-lg font-bold text-white"
            >
              {gptsearch ? "HomePage" : "GPT search"}
            </button>
            <div className=" text-white my-auto mx-1 text-black  text-[20px]  rounded-full hover:bg-opacity-80">
              {user.displayName}
            </div>

            <div className=" my-auto mx-1 hover:bg-opacity-80">
              <img
                onClick={HandleSignOut}
                className="w-12 h-12 m-4 z-10 rounded-full my-auto cursor-pointer"
                src={user?.photoURL}
                alt=""
                srcset=""
              />
            </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
