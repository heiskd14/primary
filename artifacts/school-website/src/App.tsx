import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import About from "@/pages/about";
import Admissions from "@/pages/admissions";
import SchoolLife from "@/pages/school-life";
import News from "@/pages/news";
import NewsDetail from "@/pages/news-detail";
import Staff from "@/pages/staff";
import Gallery from "@/pages/gallery";
import Contact from "@/pages/contact";
import Apply from "@/pages/apply";
import Admin from "@/pages/admin";
import Portals from "@/pages/portals";
import StudentPortal from "@/pages/student-portal";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
      retry: 1,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/admissions" component={Admissions} />
      <Route path="/school-life" component={SchoolLife} />
      <Route path="/news" component={News} />
      <Route path="/news/:id">
        {(params) => <NewsDetail id={Number(params.id)} />}
      </Route>
      <Route path="/staff" component={Staff} />
      <Route path="/gallery" component={Gallery} />
      <Route path="/contact" component={Contact} />
      <Route path="/apply" component={Apply} />
      <Route path="/admin" component={Admin} />
      <Route path="/portals" component={Portals} />
      <Route path="/student-portal" component={StudentPortal} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
