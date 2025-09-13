
export enum SlideLayout {
  Title = 'TITLE',
  Content = 'CONTENT',
  SectionHeader = 'SECTION_HEADER',
  ThankYou = 'THANK_YOU',
}

export interface Slide {
  id: string;
  title: string;
  content: string[];
  layout: SlideLayout;
}

export interface Presentation {
    slides: Omit<Slide, 'id'>[];
}
