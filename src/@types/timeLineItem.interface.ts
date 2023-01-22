export interface TimeLineElement {
  id: string;
  type: "video" | "empty_space" | "text";
  line?: number;
  emptyDuration: number;
  params: {
    duration: number;
    selectedDuration: number;
    startTime: number;
    endTime: number;
    preview: string;
  };
}
