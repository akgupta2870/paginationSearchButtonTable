import React from "react";
import { Box, Button } from "grommet";
export function Layer() {
  const [show, setShow] = React.useState();
  return (
    <Layer onEsc={() => setShow(false)} onClickOutside={() => setShow(false)}>
      <Button label="close" onClick={() => setShow(false)} />
    </Layer>
  );
}
