import { type FC } from "react";
import { useMediaQuery } from "../../../utils/hooks/useMediaQuery.hook";
import { HeaderDesktop } from "./desktop/HeaderDesktop";
import { HeaderMobile } from "./mobile/HeaderMobile";
import { TrapezoidMenu } from "./desktop/trapezoid-menu/TrapezoidMenu";

export const Header: FC = () => {
  const isMobile = useMediaQuery("(max-width: 860px)");

  return (
    <>
      {isMobile ? <HeaderMobile /> : <HeaderDesktop />}
      {!isMobile && <TrapezoidMenu />}
    </>
  );
};
