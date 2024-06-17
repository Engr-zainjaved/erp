import React, { FC, ReactNode, useContext, useRef, RefObject } from "react";
import { motion, MotionStyle } from "framer-motion";
import classNames from "classnames";
import ThemeContext from "../../context/themeContext";
import useAsideTouch from "../../hooks/useAsideTouch";
import useMounted from "../../hooks/useMounted";
import { useRouter } from "next/router";
import withOutAsideRoutes from "../../routes/asideRoutes";
import { pathToRoute } from "../../helpers/helpers";
import Tooltips from "../../components/bootstrap/Tooltips";

interface IAsideHeadProps {
  children: ReactNode;
}
export const AsideHead: FC<IAsideHeadProps> = ({ children }) => {
  return <div className="aside-head">{children}</div>;
};

interface IAsideBodyProps {
  children: ReactNode;
}
export const AsideBody: FC<IAsideBodyProps> = ({ children }) => {
  return <div className="aside-body">{children}</div>;
};

interface IAsideFootProps {
  children: ReactNode;
}
export const AsideFoot: FC<IAsideFootProps> = ({ children }) => {
  return <div className="aside-foot">{children}</div>;
};

interface IAsideProps {
  children: any;
}

const Aside: FC<IAsideProps> = ({ children }) => {
  const { asideStatus } = useContext(ThemeContext);

  const { asideStyle, touchStatus, hasTouchButton, asideWidthWithSpace, x } = useAsideTouch();

  const isModernDesign = process.env.NEXT_PUBLIC_MODERN_DESGIN === "true";

  const constraintsRef = useRef(null);

  const { mounted } = useMounted();

  const router = useRouter();

  if (withOutAsideRoutes.find((key) => key.path === pathToRoute(router.pathname))) return null;

  return (
    <>
      <motion.aside
        style={true ? (asideStyle as MotionStyle) : undefined}
        className={classNames("aside", {
          open: mounted && asideStatus,
          "aside-touch-bar": mounted && hasTouchButton && isModernDesign,
          "aside-touch-bar-close": mounted && !touchStatus && hasTouchButton && isModernDesign,
          "aside-touch-bar-open": mounted && touchStatus && hasTouchButton && isModernDesign,
        })}
      >
        {children}
      </motion.aside>
    </>
  );
};

export default Aside;
