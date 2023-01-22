import { Box, Button, List, ListItem } from '@chakra-ui/react';
import { useRef } from 'react';
import { FiScissors, FiTrash2 } from 'react-icons/fi';
import { RxViewVertical } from 'react-icons/rx';

import { useMenuAndSelectContext } from '../../hooks/useMenuAndSelectContext';

export type Points = {
  x: number;
  y: number;
};

const ItemContextMenu = () => {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const {
    contextMenuPoints,
    contextMenuClick,
    splitElements,
    handleDelete,
    handleDuplicate,
  } = useMenuAndSelectContext();

  if (!contextMenuPoints || !contextMenuClick) {
    return null;
  }

  const getTopPosition = (y: number) => {
    const widthHeight = window.innerHeight;
    if (!menuRef.current || widthHeight - y > 100) {
      return y;
    }
    const menuRect = menuRef.current.getBoundingClientRect();
    return y - menuRect.height;
  };

  return (
    <Box
      ref={menuRef}
      boxShadow={"outline"}
      position={"fixed"}
      borderRadius={"5px"}
      zIndex={10}
      w={"175px"}
      padding={"10px"}
      bg={"white"}
      left={contextMenuPoints.x}
      top={getTopPosition(contextMenuPoints.y)}
    >
      <List display={"flex"} flexDirection={"column"} gap={"10px"}>
        <ListItem>
          <Button
            h={"30px"}
            w={"100%"}
            display={"flex"}
            gap={"10px"}
            alignItems={"center"}
            onPointerDown={handleDelete}
          >
            <FiTrash2 /> Delete scenes
          </Button>
        </ListItem>
        <ListItem>
          <Button
            onPointerDown={handleDuplicate}
            h={"30px"}
            w={"100%"}
            display={"flex"}
            gap={"10px"}
            alignItems={"center"}
          >
            <RxViewVertical />
            Duplicate scenes
          </Button>
        </ListItem>
        <ListItem>
          <Button
            onPointerDown={splitElements}
            h={"30px"}
            w={"100%"}
            display={"flex"}
            gap={"10px"}
            alignItems={"center"}
          >
            <FiScissors />
            Split scenes
          </Button>
        </ListItem>
      </List>
    </Box>
  );
};
export default ItemContextMenu;
