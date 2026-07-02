import { Dumbbell, TrendingUp, UtensilsCrossed, Activity } from "lucide-react";

const BRAND_PINK = "#C8247F";

const tools = [
  {
    icon: Dumbbell,
    title: "Custom Workout Plans",
    description: "Personalized strength & cardio routines built for your body, goals, and fitness level.",
    image: "/manus-storage/phone_workout_trimmed_5ff2e831.png",
    accent: "#7C3AED", // purple to match the app's workout button
  },
  {
    icon: TrendingUp,
    title: "Track Your Progress",
    description: "See weight, measurements, and activity trends over time — real data that keeps you motivated.",
    image: "/manus-storage/phone_progress_trimmed_b93118b6.png",
    accent: "#10B981", // green to match the app's progress charts
  },
  {
    icon: UtensilsCrossed,
    title: "Personalized Nutrition",
    description: "Meal plans with macros, calories, and recipes tailored to your metabolism and treatment.",
    image: "/manus-storage/phone_nutrition_trimmed_97f21361.png",
    accent: BRAND_PINK, // pink to match the calorie bar
  },
  {
    icon: Activity,
    title: "Activity & Device Sync",
    description: "Connect your Apple Watch or wearable to automatically track steps, calories, and movement.",
    image: "/manus-storage/phone_activity_trimmed_bce06435.png",
    accent: "#2563EB", // blue to match the activity ring
  },
];

export default function PatientTools() {
  return (
    <section className="py-20 px-4" style={{ background: "#FAFAFA" }}>
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-14">
          <p
            className="text-xs font-bold tracking-widest uppercase mb-3"
            style={{ color: BRAND_PINK }}
          >
            YOUR HEALTH TOOLKIT
          </p>
          <h2
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-3"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Powerful Tools to Keep You on Track
          </h2>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Included with Transformation & Longevity memberships.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center group"
              >
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${tool.accent}15` }}
                >
                  <Icon className="w-6 h-6" style={{ color: tool.accent }} />
                </div>

                {/* Title — fixed height */}
                <h3 className="text-lg font-bold text-gray-900 mb-1.5 h-[28px] flex items-center">
                  {tool.title}
                </h3>

                {/* Description — fixed height */}
                <p className="text-sm text-gray-600 leading-relaxed max-w-[240px] mx-auto mb-5 min-h-[72px] flex items-start justify-center text-center">
                  {tool.description}
                </p>

                {/* Phone Image */}
                <div className="w-full max-w-[220px] mx-auto transition-transform duration-500 group-hover:-translate-y-2">
                  <img
                    src={tool.image}
                    alt={tool.title}
                    className="w-full h-auto object-contain drop-shadow-lg"
                    loading="lazy"
                  />
                </div>
              </div>
            );
          })}
        </div>


      </div>
    </section>
  );
}
