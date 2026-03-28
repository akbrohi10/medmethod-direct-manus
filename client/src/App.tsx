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
import BlogPost from "./pages/BlogPost";
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
      <Route path="/maryland" component={LocationMaryland} />
      <Route path="/maryland/bethesda" component={LocationBethesda} />
      <Route path="/maryland/chevy-chase" component={LocationChevyChase} />
      <Route path="/maryland/potomac" component={LocationPotomac} />
      <Route path="/maryland/rockville" component={LocationRockville} />
      <Route path="/maryland/silver-spring" component={LocationSilverSpring} />
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
