import { useEffect } from 'react';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { animated, useSpring } from 'react-spring';

import { useDragZoneContext } from '../../hooks/useDragZoneContext';

const AddNewDragContainerButton = ({ scrollBoxRef }: { scrollBoxRef: any }) => {
  const { addNewContainer } = useDragZoneContext();
  const [buttonStyles, setButtonStyles] = useSpring(() => ({
    left: (window.innerHeight - 92) / 2,
  }));
  const onContainerScrolling = (e: any) => {
    if (!scrollBoxRef.current) return;
    setButtonStyles({
      left:
        scrollBoxRef.current.scrollLeft +
        scrollBoxRef.current.offsetWidth / 2 -
        92,
    });
  };

  useEffect(() => {
    if (scrollBoxRef.current) {
      setButtonStyles({
        left:
          scrollBoxRef.current.scrollLeft +
          scrollBoxRef.current.offsetWidth / 2 -
          92,
      });
      scrollBoxRef.current.addEventListener("scroll", onContainerScrolling);
    }
  }, []);
  return (
    <animated.div
      className={"addContainerButton"}
      onClick={addNewContainer}
      style={{
        cursor: "pointer",
        height: "32px",
        width: "120px",
        position: "relative",
        left: buttonStyles.left,
        display: "flex",
        alignItems: "center",
        borderRadius: "5px",
        background: "grey",
        justifyContent: "center",
        marginBottom: "20px",
      }}
    >
      <IoIosAddCircleOutline className={"addContainerButton"} size={"30px"} />
    </animated.div>
  );
};
export default AddNewDragContainerButton;
