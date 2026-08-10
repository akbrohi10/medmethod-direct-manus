import { Suspense, lazy } from "react";
import { Toaster } from "sonner";
import SocialProofNotifications from "./components/SocialProofNotifications";
import SocialProofNotificationsLP from "./components/SocialProofNotificationsLP";
import { useLocation } from "wouter";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

// Eagerly load the main homepage (most visitors land here)
import Home1 from "./pages/Home1";
const HomeHrt3 = lazy(() => import("./pages/HomeHrt3"));

// Lazy load everything else
const Home = lazy(() => import("./pages/Home"));
const Home2 = lazy(() => import("./pages/Home2"));
const MaleHome = lazy(() => import("./pages/MaleHome"));
const BlogIndex = lazy(() => import("./pages/BlogIndex"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const StartWomen = lazy(() => import("@/pages/StartWomen"));
const DiscoveryCall = lazy(() => import("@/pages/DiscoveryCall"));
const BookPage = lazy(() => import("@/pages/BookPage"));
const ThankYou = lazy(() => import("@/pages/ThankYou"));
const MedicationPricing = lazy(() => import("@/pages/MedicationPricing"));
const LpHrt = lazy(() => import("@/pages/LpHrt"));
const LpHrt2 = lazy(() => import("@/pages/LpHrt2"));
const LpHrt3 = lazy(() => import("@/pages/LpHrt3"));
const BrandAmbassador = lazy(() => import("@/pages/BrandAmbassador"));
const LpGlp1 = lazy(() => import("@/pages/LpGlp1"));
const BeforeYouStartTreatment = lazy(() => import("@/pages/BeforeYouStartTreatment"));
const Locations = lazy(() => import("@/pages/Locations"));
const AdminSettings = lazy(() => import("@/pages/AdminSettings"));
const AdminLogin = lazy(() => import("@/pages/AdminLogin"));
const ThanksPayment = lazy(() => import("@/pages/ThanksPayment"));
const DrAldeekBooking = lazy(() => import("@/pages/DrAldeekBooking"));

// Legal pages
const PrivacyPolicy = lazy(() => import("@/pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("@/pages/TermsOfService"));
const HipaaNotice = lazy(() => import("@/pages/HipaaNotice"));
const ConsentTelehealth = lazy(() => import("@/pages/ConsentTelehealth"));
const SubscriptionPolicy = lazy(() => import("@/pages/SubscriptionPolicy"));
const TestPayment = lazy(() => import("@/pages/TestPayment"));
const LpWL2 = lazy(() => import("@/pages/LpWL2"));
const ThankYou2 = lazy(() => import("@/pages/ThankYou2"));
const Accessibility = lazy(() => import("@/pages/Accessibility"));

// Location pages - Virginia
const LocationVirginia = lazy(() => import("@/pages/LocationVirginia"));
const LocationMcLean = lazy(() => import("@/pages/LocationMcLean"));
const LocationGreatFalls = lazy(() => import("@/pages/LocationGreatFalls"));
const LocationVienna = lazy(() => import("@/pages/LocationVienna"));
const LocationReston = lazy(() => import("@/pages/LocationReston"));
const LocationArlington = lazy(() => import("@/pages/LocationArlington"));
const LocationCulpeperVA = lazy(() => import("@/pages/LocationCulpeperVA"));
const LocationWarrentonVA = lazy(() => import("@/pages/LocationWarrentonVA"));
const LocationMiddleburgVA = lazy(() => import("@/pages/LocationMiddleburgVA"));
const LocationLeesburgVA = lazy(() => import("@/pages/LocationLeesburgVA"));
const LocationFredericksburgVA = lazy(() => import("@/pages/LocationFredericksburgVA"));
const LocationAlexandriaVA = lazy(() => import("@/pages/LocationAlexandriaVA"));
const LocationFallsChurchVA = lazy(() => import("@/pages/LocationFallsChurchVA"));
const LocationTysonsVA = lazy(() => import("@/pages/LocationTysonsVA"));
const LocationHerndonVA = lazy(() => import("@/pages/LocationHerndonVA"));

// Location pages - Maryland
const LocationMaryland = lazy(() => import("@/pages/LocationMaryland"));
const LocationBethesda = lazy(() => import("@/pages/LocationBethesda"));
const LocationChevyChase = lazy(() => import("@/pages/LocationChevyChase"));
const LocationPotomac = lazy(() => import("@/pages/LocationPotomac"));
const LocationRockville = lazy(() => import("@/pages/LocationRockville"));
const LocationSilverSpring = lazy(() => import("@/pages/LocationSilverSpring"));
const LocationEastonMD = lazy(() => import("@/pages/LocationEastonMD"));
const LocationFrederickMD = lazy(() => import("@/pages/LocationFrederickMD"));
const LocationAnnapolisMD = lazy(() => import("@/pages/LocationAnnapolisMD"));
const LocationBelAirMD = lazy(() => import("@/pages/LocationBelAirMD"));
const LocationEllicottCityMD = lazy(() => import("@/pages/LocationEllicottCityMD"));
const LocationChevyChaseMD = lazy(() => import("@/pages/LocationChevyChaseMD"));

// Location pages - DC
const LocationDC = lazy(() => import("@/pages/LocationDC"));
const LocationGeorgetown = lazy(() => import("@/pages/LocationGeorgetown"));
const LocationCapitolHill = lazy(() => import("@/pages/LocationCapitolHill"));
const LocationDupontCircle = lazy(() => import("@/pages/LocationDupontCircle"));
const LocationChevyChaseDC = lazy(() => import("@/pages/LocationChevyChaseDC"));
const LocationFriendshipHeights = lazy(() => import("@/pages/LocationFriendshipHeights"));

// Location pages - Florida
const LocationFlorida = lazy(() => import("@/pages/LocationFlorida"));
const LocationMiami = lazy(() => import("@/pages/LocationMiami"));
const LocationBocaRaton = lazy(() => import("@/pages/LocationBocaRaton"));
const LocationNaples = lazy(() => import("@/pages/LocationNaples"));
const LocationSarasota = lazy(() => import("@/pages/LocationSarasota"));
const LocationTampa = lazy(() => import("@/pages/LocationTampa"));
const LocationMarcoIslandFL = lazy(() => import("@/pages/LocationMarcoIslandFL"));
const LocationVeroBeachFL = lazy(() => import("@/pages/LocationVeroBeachFL"));
const LocationJupiterFL = lazy(() => import("@/pages/LocationJupiterFL"));
const LocationPalmBeachGardensFL = lazy(() => import("@/pages/LocationPalmBeachGardensFL"));
const LocationPonteVedraFL = lazy(() => import("@/pages/LocationPonteVedraFL"));

// Location pages - North Carolina
const LocationNorthCarolina = lazy(() => import("@/pages/LocationNorthCarolina"));
const LocationCharlotteNC = lazy(() => import("@/pages/LocationCharlotteNC"));
const LocationRaleighNC = lazy(() => import("@/pages/LocationRaleighNC"));
const LocationCaryNC = lazy(() => import("@/pages/LocationCaryNC"));
const LocationChapelHillNC = lazy(() => import("@/pages/LocationChapelHillNC"));
const LocationWilmingtonNC = lazy(() => import("@/pages/LocationWilmingtonNC"));
const LocationAshevilleNC = lazy(() => import("@/pages/LocationAshevilleNC"));
const LocationPinehurstNC = lazy(() => import("@/pages/LocationPinehurstNC"));
const LocationSouthernPinesNC = lazy(() => import("@/pages/LocationSouthernPinesNC"));
const LocationMooresvilleNC = lazy(() => import("@/pages/LocationMooresvilleNC"));
const LocationWaxhawNC = lazy(() => import("@/pages/LocationWaxhawNC"));
const LocationApexNC = lazy(() => import("@/pages/LocationApexNC"));

// Location pages - Pennsylvania
const LocationPennsylvania = lazy(() => import("@/pages/LocationPennsylvania"));
const LocationPhiladelphiaPA = lazy(() => import("@/pages/LocationPhiladelphiaPA"));
const LocationPittsburghPA = lazy(() => import("@/pages/LocationPittsburghPA"));
const LocationWaynePA = lazy(() => import("@/pages/LocationWaynePA"));
const LocationDoylestownPA = lazy(() => import("@/pages/LocationDoylestownPA"));
const LocationNewtownSquarePA = lazy(() => import("@/pages/LocationNewtownSquarePA"));
const LocationMalvernPA = lazy(() => import("@/pages/LocationMalvernPA"));
const LocationKennettSquarePA = lazy(() => import("@/pages/LocationKennettSquarePA"));
const LocationWestChesterPA = lazy(() => import("@/pages/LocationWestChesterPA"));
const LocationNewtownPA = lazy(() => import("@/pages/LocationNewtownPA"));
const LocationHorshamPA = lazy(() => import("@/pages/LocationHorshamPA"));
const LocationLansdalePA = lazy(() => import("@/pages/LocationLansdalePA"));

// Location pages - Colorado
const LocationColorado = lazy(() => import("@/pages/LocationColorado"));
const LocationDenverCO = lazy(() => import("@/pages/LocationDenverCO"));
const LocationBoulderCO = lazy(() => import("@/pages/LocationBoulderCO"));
const LocationColoradoSpringsCO = lazy(() => import("@/pages/LocationColoradoSpringsCO"));
const LocationHighlandsRanchCO = lazy(() => import("@/pages/LocationHighlandsRanchCO"));
const LocationFortCollinsCO = lazy(() => import("@/pages/LocationFortCollinsCO"));
const LocationGreenwoodVillageCO = lazy(() => import("@/pages/LocationGreenwoodVillageCO"));
const LocationCastleRockCO = lazy(() => import("@/pages/LocationCastleRockCO"));
const LocationParkerCO = lazy(() => import("@/pages/LocationParkerCO"));
const LocationLongmontCO = lazy(() => import("@/pages/LocationLongmontCO"));
const LocationLovelandCO = lazy(() => import("@/pages/LocationLovelandCO"));
const LocationSteamboatSpringsCO = lazy(() => import("@/pages/LocationSteamboatSpringsCO"));

// Location pages - Arizona
const LocationArizona = lazy(() => import("@/pages/LocationArizona"));
const LocationScottsdaleAZ = lazy(() => import("@/pages/LocationScottsdaleAZ"));
const LocationParadiseValleyAZ = lazy(() => import("@/pages/LocationParadiseValleyAZ"));
const LocationChandlerAZ = lazy(() => import("@/pages/LocationChandlerAZ"));
const LocationGilbertAZ = lazy(() => import("@/pages/LocationGilbertAZ"));
const LocationTempeAZ = lazy(() => import("@/pages/LocationTempeAZ"));
const LocationTucsonAZ = lazy(() => import("@/pages/LocationTucsonAZ"));
const LocationPeoriaAZ = lazy(() => import("@/pages/LocationPeoriaAZ"));
const LocationQueenCreekAZ = lazy(() => import("@/pages/LocationQueenCreekAZ"));
const LocationSurpriseAZ = lazy(() => import("@/pages/LocationSurpriseAZ"));
const LocationFountainHillsAZ = lazy(() => import("@/pages/LocationFountainHillsAZ"));
const LocationPrescottAZ = lazy(() => import("@/pages/LocationPrescottAZ"));

// Location pages - Texas
const LocationTexas = lazy(() => import("@/pages/LocationTexas"));
const LocationHoustonTX = lazy(() => import("@/pages/LocationHoustonTX"));
const LocationAustinTX = lazy(() => import("@/pages/LocationAustinTX"));
const LocationDallasTX = lazy(() => import("@/pages/LocationDallasTX"));
const LocationSanAntonioTX = lazy(() => import("@/pages/LocationSanAntonioTX"));
const LocationTheWoodlandsTX = lazy(() => import("@/pages/LocationTheWoodlandsTX"));
const LocationPlanoTX = lazy(() => import("@/pages/LocationPlanoTX"));
const LocationMcKinneyTX = lazy(() => import("@/pages/LocationMcKinneyTX"));
const LocationSugarLandTX = lazy(() => import("@/pages/LocationSugarLandTX"));
const LocationFriscoTX = lazy(() => import("@/pages/LocationFriscoTX"));
const LocationRoundRockTX = lazy(() => import("@/pages/LocationRoundRockTX"));

// Article imports — each file self-registers into articleComponents on load
import "./articles/why-weight-gain-feels-different-in-menopause";
import "./articles/what-is-food-noise-midlife";
import "./articles/semaglutide-vs-tirzepatide-women-midlife";
import "./articles/hormone-therapy-weight-sleep-metabolism";
import "./articles/putting-yourself-last-has-to-change";

// Loading fallback
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-3 border-pink-500 border-t-transparent animate-spin" />
        <span className="text-sm text-gray-500">Loading...</span>
      </div>
    </div>
  );
}
function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path={"/"} component={HomeHrt3} />
        <Route path={"/male"} component={MaleHome} />
        <Route path={"/blog"} component={BlogIndex} />
        <Route path={"/blog/:slug"} component={BlogPost} />
        <Route path={"/virginia"} component={LocationVirginia} />
        <Route path="/virginia/mclean" component={LocationMcLean} />
        <Route path="/virginia/great-falls" component={LocationGreatFalls} />
        <Route path="/virginia/vienna" component={LocationVienna} />
        <Route path="/virginia/reston" component={LocationReston} />
        <Route path="/virginia/arlington" component={LocationArlington} />
        <Route path="/virginia/culpeper" component={LocationCulpeperVA} />
        <Route path="/virginia/warrenton" component={LocationWarrentonVA} />
        <Route path="/virginia/middleburg" component={LocationMiddleburgVA} />
        <Route path="/virginia/leesburg" component={LocationLeesburgVA} />
        <Route path="/virginia/fredericksburg" component={LocationFredericksburgVA} />
        <Route path="/virginia/alexandria" component={LocationAlexandriaVA} />
        <Route path="/virginia/falls-church" component={LocationFallsChurchVA} />
        <Route path="/virginia/tysons" component={LocationTysonsVA} />
        <Route path="/virginia/herndon" component={LocationHerndonVA} />
        <Route path="/maryland" component={LocationMaryland} />
        <Route path="/maryland/bethesda" component={LocationBethesda} />
        <Route path="/maryland/chevy-chase" component={LocationChevyChase} />
        <Route path="/maryland/potomac" component={LocationPotomac} />
        <Route path="/maryland/rockville" component={LocationRockville} />
        <Route path="/maryland/silver-spring" component={LocationSilverSpring} />
        <Route path="/maryland/easton" component={LocationEastonMD} />
        <Route path="/maryland/frederick" component={LocationFrederickMD} />
        <Route path="/maryland/annapolis" component={LocationAnnapolisMD} />
        <Route path="/maryland/bel-air" component={LocationBelAirMD} />
        <Route path="/maryland/ellicott-city" component={LocationEllicottCityMD} />
        <Route path="/maryland/chevy-chase-md" component={LocationChevyChaseMD} />
        <Route path="/washington-dc" component={LocationDC} />
        <Route path="/washington-dc/georgetown" component={LocationGeorgetown} />
        <Route path="/washington-dc/capitol-hill" component={LocationCapitolHill} />
        <Route path="/washington-dc/dupont-circle" component={LocationDupontCircle} />
        <Route path="/washington-dc/chevy-chase-dc" component={LocationChevyChaseDC} />
        <Route path="/washington-dc/friendship-heights" component={LocationFriendshipHeights} />
        <Route path="/florida" component={LocationFlorida} />
        <Route path="/florida/miami" component={LocationMiami} />
        <Route path="/florida/boca-raton" component={LocationBocaRaton} />
        <Route path="/florida/naples" component={LocationNaples} />
        <Route path="/florida/sarasota" component={LocationSarasota} />
        <Route path="/florida/tampa" component={LocationTampa} />
        <Route path="/florida/marco-island" component={LocationMarcoIslandFL} />
        <Route path="/florida/vero-beach" component={LocationVeroBeachFL} />
        <Route path="/florida/jupiter" component={LocationJupiterFL} />
        <Route path="/florida/palm-beach-gardens" component={LocationPalmBeachGardensFL} />
        <Route path="/florida/ponte-vedra" component={LocationPonteVedraFL} />
        <Route path="/north-carolina" component={LocationNorthCarolina} />
        <Route path="/north-carolina/charlotte" component={LocationCharlotteNC} />
        <Route path="/north-carolina/raleigh" component={LocationRaleighNC} />
        <Route path="/north-carolina/cary" component={LocationCaryNC} />
        <Route path="/north-carolina/chapel-hill" component={LocationChapelHillNC} />
        <Route path="/north-carolina/wilmington" component={LocationWilmingtonNC} />
        <Route path="/north-carolina/asheville" component={LocationAshevilleNC} />
        <Route path="/north-carolina/pinehurst" component={LocationPinehurstNC} />
        <Route path="/north-carolina/southern-pines" component={LocationSouthernPinesNC} />
        <Route path="/north-carolina/mooresville" component={LocationMooresvilleNC} />
        <Route path="/north-carolina/waxhaw" component={LocationWaxhawNC} />
        <Route path="/north-carolina/apex" component={LocationApexNC} />
        <Route path="/pennsylvania" component={LocationPennsylvania} />
        <Route path="/pennsylvania/philadelphia" component={LocationPhiladelphiaPA} />
        <Route path="/pennsylvania/pittsburgh" component={LocationPittsburghPA} />
        <Route path="/pennsylvania/wayne" component={LocationWaynePA} />
        <Route path="/pennsylvania/doylestown" component={LocationDoylestownPA} />
        <Route path="/pennsylvania/newtown-square" component={LocationNewtownSquarePA} />
        <Route path="/pennsylvania/malvern" component={LocationMalvernPA} />
        <Route path="/pennsylvania/kennett-square" component={LocationKennettSquarePA} />
        <Route path="/pennsylvania/west-chester" component={LocationWestChesterPA} />
        <Route path="/pennsylvania/newtown" component={LocationNewtownPA} />
        <Route path="/pennsylvania/horsham" component={LocationHorshamPA} />
        <Route path="/pennsylvania/lansdale" component={LocationLansdalePA} />
        <Route path="/colorado" component={LocationColorado} />
        <Route path="/colorado/denver" component={LocationDenverCO} />
        <Route path="/colorado/boulder" component={LocationBoulderCO} />
        <Route path="/colorado/colorado-springs" component={LocationColoradoSpringsCO} />
        <Route path="/colorado/highlands-ranch" component={LocationHighlandsRanchCO} />
        <Route path="/colorado/fort-collins" component={LocationFortCollinsCO} />
        <Route path="/colorado/greenwood-village" component={LocationGreenwoodVillageCO} />
        <Route path="/colorado/castle-rock" component={LocationCastleRockCO} />
        <Route path="/colorado/parker" component={LocationParkerCO} />
        <Route path="/colorado/longmont" component={LocationLongmontCO} />
        <Route path="/colorado/loveland" component={LocationLovelandCO} />
        <Route path="/colorado/steamboat-springs" component={LocationSteamboatSpringsCO} />
        <Route path="/arizona" component={LocationArizona} />
        <Route path="/arizona/scottsdale" component={LocationScottsdaleAZ} />
        <Route path="/arizona/paradise-valley" component={LocationParadiseValleyAZ} />
        <Route path="/arizona/chandler" component={LocationChandlerAZ} />
        <Route path="/arizona/gilbert" component={LocationGilbertAZ} />
        <Route path="/arizona/tempe" component={LocationTempeAZ} />
        <Route path="/arizona/tucson" component={LocationTucsonAZ} />
        <Route path="/arizona/peoria" component={LocationPeoriaAZ} />
        <Route path="/arizona/queen-creek" component={LocationQueenCreekAZ} />
        <Route path="/arizona/surprise" component={LocationSurpriseAZ} />
        <Route path="/arizona/fountain-hills" component={LocationFountainHillsAZ} />
        <Route path="/arizona/prescott" component={LocationPrescottAZ} />
        <Route path="/texas" component={LocationTexas} />
        <Route path="/texas/houston" component={LocationHoustonTX} />
        <Route path="/texas/austin" component={LocationAustinTX} />
        <Route path="/texas/dallas" component={LocationDallasTX} />
        <Route path="/texas/san-antonio" component={LocationSanAntonioTX} />
        <Route path="/texas/the-woodlands" component={LocationTheWoodlandsTX} />
        <Route path="/texas/plano" component={LocationPlanoTX} />
        <Route path="/texas/mckinney" component={LocationMcKinneyTX} />
        <Route path="/texas/sugar-land" component={LocationSugarLandTX} />
        <Route path="/texas/frisco" component={LocationFriscoTX} />
        <Route path="/texas/round-rock" component={LocationRoundRockTX} />
        <Route path="/lp/hrt" component={LpHrt} />
        <Route path="/lp/hrt2" component={LpHrt2} />
        <Route path="/lp/hrt3" component={LpHrt3} />
        <Route path="/lp/WL" component={LpGlp1} />
        <Route path="/brand-ambassador" component={BrandAmbassador} />
        <Route path="/dr-aldeek-booking" component={DrAldeekBooking} />
        <Route path="/discovery-call" component={DiscoveryCall} />
        <Route path="/book">{() => { window.location.replace("/the-menopause-weight-loss-trap"); return null; }}</Route>
        <Route path="/the-menopause-weight-loss-trap" component={BookPage} />
        <Route path="/thank-you" component={ThankYou} />
        <Route path="/pricing-guide" component={MedicationPricing} />
        <Route path="/before-you-start-treatment" component={BeforeYouStartTreatment} />
        <Route path="/locations" component={Locations} />
        <Route path="/start/women" component={StartWomen} />
        <Route path="/start/men">{() => { window.location.href = "/male"; return null; }}</Route>
        <Route path="/home-1" component={Home1} />
        <Route path="/home-v1" component={Home1} />
        <Route path="/home-2" component={Home2} />
        <Route path="/home-3" component={Home} />
        <Route path="/privacy-policy" component={PrivacyPolicy} />
        <Route path="/terms" component={TermsOfService} />
        <Route path="/hipaa-notice" component={HipaaNotice} />
        <Route path="/consent-to-telehealth" component={ConsentTelehealth} />
        <Route path="/subscription-policy" component={SubscriptionPolicy} />
        <Route path="/accessibility" component={Accessibility} />
        <Route path="/privacy">{() => { window.location.href = "/privacy-policy"; return null; }}</Route>
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin/settings" component={AdminSettings} />
        <Route path="/thanks-payment" component={ThanksPayment} />
        <Route path="/test-payment" component={TestPayment} />
        <Route path="/lp/WL2" component={LpWL2} />
        <Route path="/thank-you2" component={ThankYou2} />
        <Route path={"/404"} component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function SocialProofNotificationsRouter() {
  const [location] = useLocation();
  const isLpPage = location === "/lp/WL" || location === "/lp/hrt3" || location === "/" || location === "/lp/WL2";
  if (isLpPage) return <SocialProofNotificationsLP />;
  return <SocialProofNotifications />;
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster position="top-center" richColors />
          <SocialProofNotificationsRouter />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
