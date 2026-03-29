import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import MaleHome from "./pages/MaleHome";
import BlogIndex from "./pages/BlogIndex";
import LocationMcLean from "@/pages/LocationMcLean";
import LocationGreatFalls from "@/pages/LocationGreatFalls";
import LocationVirginia from "@/pages/LocationVirginia";
import LocationVienna from "@/pages/LocationVienna";
import LocationReston from "@/pages/LocationReston";
import LocationArlington from "@/pages/LocationArlington";
import StartWomen from "@/pages/StartWomen";
import LocationMaryland from "@/pages/LocationMaryland";
import LocationBethesda from "@/pages/LocationBethesda";
import LocationChevyChase from "@/pages/LocationChevyChase";
import LocationPotomac from "@/pages/LocationPotomac";
import LocationRockville from "@/pages/LocationRockville";
import LocationSilverSpring from "@/pages/LocationSilverSpring";
import LocationDC from "@/pages/LocationDC";
import LocationGeorgetown from "@/pages/LocationGeorgetown";
import LocationCapitolHill from "@/pages/LocationCapitolHill";
import LocationDupontCircle from "@/pages/LocationDupontCircle";
import LocationChevyChaseDC from "@/pages/LocationChevyChaseDC";
import LocationFriendshipHeights from "@/pages/LocationFriendshipHeights";
import LocationFlorida from "@/pages/LocationFlorida";
import LocationMiami from "@/pages/LocationMiami";
import LocationBocaRaton from "@/pages/LocationBocaRaton";
import LocationNaples from "@/pages/LocationNaples";
import LocationSarasota from "@/pages/LocationSarasota";
import LocationTampa from "@/pages/LocationTampa";
import BlogPost from "./pages/BlogPost";
import Locations from "@/pages/Locations";
import LocationNorthCarolina from "@/pages/LocationNorthCarolina";
import LocationCharlotteNC from "@/pages/LocationCharlotteNC";
import LocationRaleighNC from "@/pages/LocationRaleighNC";
import LocationCaryNC from "@/pages/LocationCaryNC";
import LocationChapelHillNC from "@/pages/LocationChapelHillNC";
import LocationWilmingtonNC from "@/pages/LocationWilmingtonNC";
import LocationAshevilleNC from "@/pages/LocationAshevilleNC";
import LocationPennsylvania from "@/pages/LocationPennsylvania";
import LocationPhiladelphiaPA from "@/pages/LocationPhiladelphiaPA";
import LocationPittsburghPA from "@/pages/LocationPittsburghPA";
import LocationWaynePA from "@/pages/LocationWaynePA";
import LocationDoylestownPA from "@/pages/LocationDoylestownPA";
import LocationNewtownSquarePA from "@/pages/LocationNewtownSquarePA";
import LocationMalvernPA from "@/pages/LocationMalvernPA";
import LocationColorado from "@/pages/LocationColorado";
import LocationDenverCO from "@/pages/LocationDenverCO";
import LocationBoulderCO from "@/pages/LocationBoulderCO";
import LocationColoradoSpringsCO from "@/pages/LocationColoradoSpringsCO";
import LocationHighlandsRanchCO from "@/pages/LocationHighlandsRanchCO";
import LocationFortCollinsCO from "@/pages/LocationFortCollinsCO";
import LocationGreenwoodVillageCO from "@/pages/LocationGreenwoodVillageCO";
import LocationArizona from "@/pages/LocationArizona";
import LocationScottsdaleAZ from "@/pages/LocationScottsdaleAZ";
import LocationParadiseValleyAZ from "@/pages/LocationParadiseValleyAZ";
import LocationChandlerAZ from "@/pages/LocationChandlerAZ";
import LocationGilbertAZ from "@/pages/LocationGilbertAZ";
import LocationTempeAZ from "@/pages/LocationTempeAZ";
import LocationTucsonAZ from "@/pages/LocationTucsonAZ";
import LocationCulpeperVA from "@/pages/LocationCulpeperVA";
import LocationWarrentonVA from "@/pages/LocationWarrentonVA";
import LocationMiddleburgVA from "@/pages/LocationMiddleburgVA";
import LocationLeesburgVA from "@/pages/LocationLeesburgVA";
import LocationFredericksburgVA from "@/pages/LocationFredericksburgVA";
import LocationPinehurstNC from "@/pages/LocationPinehurstNC";
import LocationSouthernPinesNC from "@/pages/LocationSouthernPinesNC";
import LocationMooresvilleNC from "@/pages/LocationMooresvilleNC";
import LocationWaxhawNC from "@/pages/LocationWaxhawNC";
import LocationApexNC from "@/pages/LocationApexNC";
// PA Tier 2
import LocationWestChesterPA from "@/pages/LocationWestChesterPA";
import LocationNewtownPA from "@/pages/LocationNewtownPA";
import LocationHorshamPA from "@/pages/LocationHorshamPA";
import LocationLansdalePA from "@/pages/LocationLansdalePA";
// CO Tier 2
import LocationCastleRockCO from "@/pages/LocationCastleRockCO";
import LocationParkerCO from "@/pages/LocationParkerCO";
import LocationLongmontCO from "@/pages/LocationLongmontCO";
import LocationLovelandCO from "@/pages/LocationLovelandCO";
import LocationSteamboatSpringsCO from "@/pages/LocationSteamboatSpringsCO";
// AZ Tier 2
import LocationPeoriaAZ from "@/pages/LocationPeoriaAZ";
import LocationQueenCreekAZ from "@/pages/LocationQueenCreekAZ";
import LocationSurpriseAZ from "@/pages/LocationSurpriseAZ";
import LocationFountainHillsAZ from "@/pages/LocationFountainHillsAZ";
import LocationPrescottAZ from "@/pages/LocationPrescottAZ";
// FL Tier 2
import LocationMarcoIslandFL from "@/pages/LocationMarcoIslandFL";
import LocationVeroBeachFL from "@/pages/LocationVeroBeachFL";
import LocationJupiterFL from "@/pages/LocationJupiterFL";
import LocationPalmBeachGardensFL from "@/pages/LocationPalmBeachGardensFL";
import LocationPonteVedraFL from "@/pages/LocationPonteVedraFL";
// MD Tier 2
import LocationEastonMD from "@/pages/LocationEastonMD";
import LocationFrederickMD from "@/pages/LocationFrederickMD";
import LocationAnnapolisMD from "@/pages/LocationAnnapolisMD";
import LocationBelAirMD from "@/pages/LocationBelAirMD";
import LocationEllicottCityMD from "@/pages/LocationEllicottCityMD";
// DC-area Tier 2
import LocationAlexandriaVA from "@/pages/LocationAlexandriaVA";
import LocationChevyChaseMD from "@/pages/LocationChevyChaseMD";
import LocationFallsChurchVA from "@/pages/LocationFallsChurchVA";
import LocationTysonsVA from "@/pages/LocationTysonsVA";
import LocationHerndonVA from "@/pages/LocationHerndonVA";
// Article imports — each file self-registers into articleComponents on load
import "./articles/why-weight-gain-feels-different-in-menopause";
import "./articles/what-is-food-noise-midlife";
import "./articles/semaglutide-vs-tirzepatide-women-midlife";
import "./articles/hormone-therapy-weight-sleep-metabolism";
import "./articles/putting-yourself-last-has-to-change";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
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
      <Route path="/maryland" component={LocationMaryland} />
      <Route path="/maryland/bethesda" component={LocationBethesda} />
      <Route path="/maryland/chevy-chase" component={LocationChevyChase} />
      <Route path="/maryland/potomac" component={LocationPotomac} />
      <Route path="/maryland/rockville" component={LocationRockville} />
      <Route path="/maryland/silver-spring" component={LocationSilverSpring} />
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
      <Route path="/colorado" component={LocationColorado} />
      <Route path="/colorado/denver" component={LocationDenverCO} />
      <Route path="/colorado/boulder" component={LocationBoulderCO} />
      <Route path="/colorado/colorado-springs" component={LocationColoradoSpringsCO} />
      <Route path="/colorado/highlands-ranch" component={LocationHighlandsRanchCO} />
      <Route path="/colorado/fort-collins" component={LocationFortCollinsCO} />
      <Route path="/colorado/greenwood-village" component={LocationGreenwoodVillageCO} />
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
      <Route path="/pennsylvania/west-chester" component={LocationWestChesterPA} />
      <Route path="/pennsylvania/newtown" component={LocationNewtownPA} />
      <Route path="/pennsylvania/horsham" component={LocationHorshamPA} />
      <Route path="/pennsylvania/lansdale" component={LocationLansdalePA} />
      <Route path="/colorado/castle-rock" component={LocationCastleRockCO} />
      <Route path="/colorado/parker" component={LocationParkerCO} />
      <Route path="/colorado/longmont" component={LocationLongmontCO} />
      <Route path="/colorado/loveland" component={LocationLovelandCO} />
      <Route path="/colorado/steamboat-springs" component={LocationSteamboatSpringsCO} />
      <Route path="/florida/marco-island" component={LocationMarcoIslandFL} />
      <Route path="/florida/vero-beach" component={LocationVeroBeachFL} />
      <Route path="/florida/jupiter" component={LocationJupiterFL} />
      <Route path="/florida/palm-beach-gardens" component={LocationPalmBeachGardensFL} />
      <Route path="/florida/ponte-vedra" component={LocationPonteVedraFL} />
      <Route path="/maryland/easton" component={LocationEastonMD} />
      <Route path="/maryland/frederick" component={LocationFrederickMD} />
      <Route path="/maryland/annapolis" component={LocationAnnapolisMD} />
      <Route path="/maryland/bel-air" component={LocationBelAirMD} />
      <Route path="/maryland/ellicott-city" component={LocationEllicottCityMD} />
      <Route path="/virginia/alexandria" component={LocationAlexandriaVA} />
      <Route path="/maryland/chevy-chase-md" component={LocationChevyChaseMD} />
      <Route path="/virginia/falls-church" component={LocationFallsChurchVA} />
      <Route path="/virginia/tysons" component={LocationTysonsVA} />
      <Route path="/virginia/herndon" component={LocationHerndonVA} />
      <Route path="/locations" component={Locations} />
      <Route path="/start/women" component={StartWomen} />
      <Route path="/start/men">{() => { window.location.href = "/male"; return null; }}</Route>
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
