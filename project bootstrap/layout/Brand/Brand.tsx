import React, { FC } from "react";
import PropTypes from "prop-types";
import Icon from "../../components/icon/Icon";
import Logo from "../../components/Logo";
import Link from "next/link";

interface IBrandProps {
  asideStatus: boolean;
  setAsideStatus(...args: unknown[]): unknown;
}
const Brand: FC<IBrandProps> = ({ asideStatus, setAsideStatus }) => {
  return (
    <div className="brand">
      <div className="brand-logo">
        <h1 className="brand-title">
          <Link href="/project" aria-label="Logo">
            Click 2 Deploy
          </Link>
        </h1>
      </div>
    </div>
  );
};
Brand.propTypes = {
  asideStatus: PropTypes.bool.isRequired,
  setAsideStatus: PropTypes.func.isRequired,
};

export default Brand;
