import StateHubPage from "@/components/location/StateHubPage";

export default function LocationGeorgia() {
  return (
    <StateHubPage
      state="Georgia"
      abbreviation="GA"
      slug="georgia"
      cities={["Atlanta", "Savannah", "Augusta", "Macon", "Columbus", "Athens"]}
      metaDescription="Physician-led virtual women's health care across Georgia, including medical weight management and hormone therapy for women. Book online with MedMethod Direct."
      regionalIntro="From metro Atlanta and Athens to Savannah, Augusta, Macon, Columbus, and communities across the state, Georgia patients can access MedMethod Direct without traveling to a clinic. The virtual format keeps appointments focused, private, and accessible from home."
    />
  );
}
