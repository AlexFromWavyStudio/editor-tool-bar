import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { v4 } from 'uuid';

import { TimeLineElement } from '../@types/timeLineItem.interface';
import { Points } from '../components/dragItems/itemContextMenu';

const noop = () => {};
const noopContextMenuHandler = () => () => {};

interface MenuAndSelectContext {
  selectedElements: string[];
  setSelectedElements: Dispatch<SetStateAction<string[]>>;
  handleDelete: () => void;
  handleDuplicate: () => void;
  splitElements: () => void;
  handleContextMenu: (id: string) => (e: any) => void;
  contextMenuPoints: Points | null;
  contextMenuClick: boolean;
}

const MenuAndSelectContext = createContext<MenuAndSelectContext>({
  selectedElements: [],
  setSelectedElements: noop,
  handleDelete: noop,
  handleDuplicate: noop,
  splitElements: noop,
  handleContextMenu: noopContextMenuHandler,
  contextMenuPoints: null,
  contextMenuClick: false,
});

export const useMenuAndSelectContext = () => useContext(MenuAndSelectContext);

export const MenuAndSelectContextWrapper = ({
  children,
  setScenes,
}: {
  children: JSX.Element;
  setScenes: Dispatch<SetStateAction<TimeLineElement[][]>>;
}) => {
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const [points, setPoints] = useState<Points | null>(null);
  const [clicked, setClicked] = useState<boolean>(false);

  const handleDelete = () => {
    setScenes((prev) => [
      ...prev.map((container) =>
        container.filter((el) => !selectedElements.includes(el.id))
      ),
    ]);
    setSelectedElements([]);
  };
  const splitElements = () => {
    setScenes((prev) => [
      ...prev.map((container) =>
        container.flatMap((el) => {
          if (selectedElements.includes(el.id)) {
            const clone = { ...el, id: v4() };
            clone.params.selectedDuration = el.params.selectedDuration / 2;
            el.params.selectedDuration = clone.params.selectedDuration;
            return [el, clone];
          }
          return el;
        })
      ),
    ]);
    setSelectedElements([]);
  };

  const handleDuplicate = () => {
    setScenes((prev) => [
      ...prev.map((container) =>
        container.flatMap((el) => {
          if (selectedElements.includes(el.id)) {
            let clone = { ...el, id: v4() };

            return [el, clone];
          }
          return el;
        })
      ),
    ]);
    setSelectedElements([]);
  };

  const handleContextMenu = (id: string) => (e: any) => {
    e.preventDefault();
    setPoints({
      x: e.clientX,
      y: e.clientY,
    });
    setClicked(true);
    setSelectedElements([id]);
  };

  const Provider = {
    selectedElements,
    setSelectedElements,
    handleDelete,
    splitElements,
    handleDuplicate,
    handleContextMenu,
    contextMenuPoints: points,
    contextMenuClick: clicked,
  };

  const handleCloseMenu = () => {
    setClicked(false);
  };
  useEffect(() => {
    window.addEventListener("click", handleCloseMenu);
    return () => {
      window.removeEventListener("click", handleCloseMenu);
    };
  }, []);
  return (
    <MenuAndSelectContext.Provider value={Provider}>
      {children}
    </MenuAndSelectContext.Provider>
  );
};
