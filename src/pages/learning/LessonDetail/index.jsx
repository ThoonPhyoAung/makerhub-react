import LearningBreadcrumb from "../components/LearningBreadcrumb";

<LearningBreadcrumb
  items={[
    { label: "Learning", path: "/learning" },
    { label: journey.title, path: `/learning/${journey.id}` },
    { label: chapter.title, path: `/learning/${journey.id}/${chapter.id}` },
    { label: lesson.title },
  ]}
/>;
