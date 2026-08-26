import StateHubPage from "@/components/location/StateHubPage";

export default function LocationIllinois() {
  return (
    <StateHubPage
      state="Illinois"
      abbreviation="IL"
      slug="illinois"
      cities={["Chicago", "Naperville", "Springfield", "Peoria", "Rockford", "Champaign"]}
      metaDescription="Physician-led virtual women's health care across Illinois, including medical weight management and hormone therapy for women. Book online with MedMethod Direct."
      regionalIntro="Illinois patients in the Chicago area, central Illinois, and communities throughout the state can meet with MedMethod Direct through secure telehealth. Virtual appointments reduce travel while preserving direct physician review of your health history and goals."
    />
  );
}
