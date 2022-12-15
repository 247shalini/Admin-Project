import React from "react";

const Header = () => {
  return (
    <div class="header d-flex justify-content-between">
      <div class="p-2">
        <img src="home-logo.png" alt="" srcset="" />
      </div>
      <div class="mx-3">
        <a href="/login">Logout</a>
      </div>
    </div>
  );
};
export default Header;
