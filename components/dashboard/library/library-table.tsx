const books = [
  {
    id: 1,
    title: "Introduction to Machine Learning",
    subject: "CS",
    pages: 420,
    progress: 72,
    uploadedAt: "Jan 15",
  },
  {
    id: 2,
    title: "Organic Chemistry Fundamentals",
    subject: "Chemistry",
    pages: 380,
    progress: 45,
    uploadedAt: "Jan 20",
  },
  {
    id: 3,
    title: "Modern Physics Vol. 2",
    subject: "Physics",
    pages: 290,
    progress: 18,
    uploadedAt: "Feb 1",
  },
  {
    id: 4,
    title: "Calculus: Early Transcendentals",
    subject: "Math",
    pages: 560,
    progress: 90,
    uploadedAt: "Dec 10",
  },
  {
    id: 5,
    title: "Data Structures & Algorithms",
    subject: "CS",
    pages: 350,
    progress: 60,
    uploadedAt: "Feb 8",
  },
  {
    id: 6,
    title: "Linear Algebra Done Right",
    subject: "Math",
    pages: 260,
    progress: 30,
    uploadedAt: "Feb 12",
  },
];

const subjectColors: Record<string, string> = {
  CS: "bg-primary/10 text-primary border-primary/20",
  Chemistry: "bg-accent/10 text-accent border-accent/20",
  Physics: "bg-destructive/10 text-destructive border-destructive/20",
  Math: "bg-secondary text-secondary-foreground border-border",
};

export default function LibraryTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const filtered = books.filter((b) =>
    b.title.toLowerCase().includes(query.toLowerCase()),
  );
  return <div>LibraryTable</div>;
}
