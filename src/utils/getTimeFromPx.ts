export const getTimeFromPx = ({
  oneSecondInPx,
  width,
}: {
  oneSecondInPx: number;
  width: number;
}) => (width / oneSecondInPx) * 1000;
