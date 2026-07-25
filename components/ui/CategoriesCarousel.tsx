import { categories } from "@/constants/categories";
import { ScrollView } from "react-native";
import CategoryPill from "./CategoryPill";

type Props = {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
};

export default function CategoriesCarousel({
  activeCategory,
  setActiveCategory,
}: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        gap: 16,
        alignItems: "center",
        paddingTop: 2,
      }}
    >
      {categories.map((category, index) => (
        <CategoryPill
          category={category}
          key={index}
          onPress={() => setActiveCategory(category)}
          isActive={category == activeCategory}
        />
      ))}
    </ScrollView>
  );
}
