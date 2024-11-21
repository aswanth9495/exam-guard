export interface RootState {
  user: {
    name: string;
  };
}

export interface Step {
  icon: React.ElementType;
  title: string;
  component: React.ReactNode;
}
