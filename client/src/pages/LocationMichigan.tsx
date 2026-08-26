import StateHubPage from "@/components/location/StateHubPage";

export default function LocationMichigan() {
  return (
    <StateHubPage
      state="Michigan"
      abbreviation="MI"
      slug="michigan"
      cities={["Detroit", "Grand Rapids", "Ann Arbor", "Lansing", "Kalamazoo", "Traverse City"]}
      metaDescription="Physician-led virtual women's health care across Michigan, including medical weight management and hormone therapy for women. Book online with MedMethod Direct."
      regionalIntro="Patients across southeast Michigan, west Michigan, mid-Michigan, and northern communities can access MedMethod Direct through secure virtual care. The statewide telehealth model makes physician-led evaluation available without a long drive to a specialty clinic."
    />
  );
}
