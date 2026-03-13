import { Brain, Upload, MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import DashboardStatus from "@/components/dashboard/dashboard-status";
import DashboardRecentBooks from "@/components/dashboard/dashboard-recent-books";

export default function DashboardOverviewPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-display">
          Welcome back, Student 👋
        </h1>
        <p className="text-muted-foreground mt-1">Here's your study overview</p>
      </div>

      {/* Stats Grid */}
      <DashboardStatus />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Books */}
        <div className="lg:col-span-2">
          <DashboardRecentBooks />
        </div>

        {/* Quick Actions */}
        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href={"/dashboard/upload"}>
              <Button className="w-full justify-start gap-3" variant="outline">
                <Upload className="h-4 w-4" />
                Upload a PDF
              </Button>
            </Link>

            <Link href="dashboard/chat">
              <Button className="w-full justify-start gap-3" variant="outline">
                <MessageCircle className="h-4 w-4" />
                Start Voice Chat
              </Button>
            </Link>

            <Link href="dashboard/quiz">
              <Button className="w-full justify-start gap-3" variant="outline">
                <Brain className="h-4 w-4" />
                Take a Quiz
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
