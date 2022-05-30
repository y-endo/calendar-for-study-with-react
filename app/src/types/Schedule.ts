type TSchedule = {
  id: string;
  date: string;
  title: string;
  place?: string;
  isImportant?: boolean;
  description?: string;
  images?: {
    fieldId: 'images';
    image_1: {
      url: string;
      width: number;
      height: number;
    };
    image_2?: {
      url: string;
      width: number;
      height: number;
    };
    image_3?: {
      url: string;
      width: number;
      height: number;
    };
  };
};

export default TSchedule;
