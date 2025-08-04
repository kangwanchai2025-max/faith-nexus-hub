import { useState } from "react";
import { format, addDays, subDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isToday } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { 
  Calendar as CalendarIcon,
  Heart,
  Users,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  User
} from "lucide-react";

// Sample events data
const events = [
  {
    id: 1,
    title: "Weekly Prayer Meeting",
    date: new Date(),
    time: "7:00 PM",
    type: "prayer",
    location: "Main Sanctuary",
    organizer: "Pastor Michael",
    attendees: 24,
    recurring: "weekly"
  },
  {
    id: 2,
    title: "Young Adults Care Group",
    date: addDays(new Date(), 2),
    time: "6:30 PM",
    type: "caregroup",
    location: "Room 203",
    organizer: "Sarah Johnson",
    attendees: 12,
    recurring: "weekly"
  },
  {
    id: 3,
    title: "Community Outreach",
    date: addDays(new Date(), 5),
    time: "9:00 AM",
    type: "outreach",
    location: "Downtown Park",
    organizer: "David Kim",
    attendees: 18,
    recurring: "monthly"
  },
  {
    id: 4,
    title: "Family Fellowship Dinner",
    date: addDays(new Date(), 7),
    time: "6:00 PM",
    type: "fellowship",
    location: "Fellowship Hall",
    organizer: "Jennifer Lopez",
    attendees: 45,
    recurring: "monthly"
  }
];

const eventTypeColors = {
  prayer: "bg-pink-500",
  caregroup: "bg-blue-500",
  outreach: "bg-green-500",
  fellowship: "bg-purple-500"
};

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewDate, setViewDate] = useState<Date>(new Date());

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(event.date, date));
  };

  const hasEvents = (date: Date) => {
    return getEventsForDate(date).length > 0;
  };

  const selectedDateEvents = getEventsForDate(selectedDate);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold">Community Calendar</h1>
            <p className="text-muted-foreground">Stay connected with prayer meetings and fellowship events</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="bg-card/60 border-border/50">
                  <CalendarIcon className="w-4 h-4" />
                  {format(selectedDate, "MMM dd, yyyy")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="p-3 pointer-events-auto"
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            
            <Button variant="divine" size="default">
              <Plus className="w-4 h-4" />
              Add Event
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Calendar */}
          <div className="lg:col-span-2">
            <Card className="bg-card/60 backdrop-blur-sm border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-serif">
                    {format(viewDate, "MMMM yyyy")}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setViewDate(subDays(viewDate, 30))}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewDate(new Date())}
                    >
                      Today
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setViewDate(addDays(viewDate, 30))}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="h-10 flex items-center justify-center text-sm font-medium text-muted-foreground">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-1">
                  {eachDayOfInterval({
                    start: startOfWeek(startOfMonth(viewDate)),
                    end: endOfWeek(endOfMonth(viewDate))
                  }).map(day => {
                    const dayEvents = getEventsForDate(day);
                    const isCurrentMonth = isSameMonth(day, viewDate);
                    const isSelected = isSameDay(day, selectedDate);
                    const isCurrentDay = isToday(day);
                    
                    return (
                      <button
                        key={day.toISOString()}
                        onClick={() => setSelectedDate(day)}
                        className={cn(
                          "h-20 p-1 border border-border/20 rounded-lg transition-all duration-200 hover:bg-accent/50",
                          !isCurrentMonth && "text-muted-foreground/50",
                          isSelected && "bg-primary/10 border-primary/30",
                          isCurrentDay && "bg-gradient-divine text-primary-foreground font-semibold"
                        )}
                      >
                        <div className="h-full flex flex-col">
                          <span className="text-sm">{format(day, 'd')}</span>
                          <div className="flex-1 flex flex-col gap-1 mt-1">
                            {dayEvents.slice(0, 2).map(event => (
                              <div
                                key={event.id}
                                className={cn(
                                  "w-full h-1.5 rounded-full",
                                  eventTypeColors[event.type as keyof typeof eventTypeColors]
                                )}
                              />
                            ))}
                            {dayEvents.length > 2 && (
                              <span className="text-xs text-muted-foreground">+{dayEvents.length - 2}</span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Selected Date Events */}
          <div className="space-y-6">
            <Card className="bg-card/60 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">
                  {format(selectedDate, "EEEE, MMMM d")}
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                {selectedDateEvents.length > 0 ? (
                  <div className="space-y-4">
                    {selectedDateEvents.map(event => (
                      <div key={event.id} className="p-4 border border-border/50 rounded-lg hover:bg-accent/30 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            "w-3 h-3 rounded-full mt-1.5",
                            eventTypeColors[event.type as keyof typeof eventTypeColors]
                          )} />
                          <div className="flex-1">
                            <h4 className="font-medium mb-1">{event.title}</h4>
                            <div className="space-y-1 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{event.time}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                <span>{event.location}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                <span>{event.organizer}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                <span>{event.attendees} attending</span>
                              </div>
                            </div>
                            <div className="mt-2">
                              <Badge variant="outline" className="text-xs">
                                {event.recurring}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No events scheduled for this day</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-card/60 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">This Month</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-pink-500" />
                    <span className="text-sm">Prayer Meetings</span>
                  </div>
                  <Badge variant="secondary">4</Badge>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">Care Groups</span>
                  </div>
                  <Badge variant="secondary">8</Badge>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Fellowship Events</span>
                  </div>
                  <Badge variant="secondary">3</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;