import { Box } from '@chakra-ui/react';
import { animated } from '@react-spring/web';

import { useLassoSelect } from '../../hooks/useLassoSelect';

const Lasso = () => {
  const {
    springStyles,
    isLassoStarted
  } = useLassoSelect('ResizableFooterContent');

  if (!isLassoStarted) {
    return null;
  }

  return (
        <animated.div
          style={{
            cursor: "pointer",
            position: "absolute",
            border: "1px solid #00beff",
            background: "rgba(0, 190, 255, 0.1)",
            zIndex: 1000,
            pointerEvents: 'none',
            top: springStyles.top,
            left: springStyles.left,
            width: springStyles.width,
            height: springStyles.height,
          }}
        ></animated.div>
  );
};

export default Lasso;
