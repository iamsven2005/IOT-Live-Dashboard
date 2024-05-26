"use client"
import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ResponsiveLine } from "@nivo/line"
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"

export default function Component() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-6 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Cars</CardTitle>
            <CarIcon className="w-8 h-8 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">245</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Available for rent</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Cars Rented</CardTitle>
            <CarIcon className="w-8 h-8 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">157</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Currently rented out</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Under Maintenance</CardTitle>
            <WrenchIcon className="w-8 h-8 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">28</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Being serviced</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
            <DollarSignIcon className="w-8 h-8 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">$125,487</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Last 30 days</p>
          </CardContent>
        </Card>
        <div className="col-span-1 md:col-span-2 lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Rental Data</CardTitle>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline">
                  Daily
                </Button>
                <Button size="sm" variant="outline">
                  Weekly
                </Button>
                <Button size="sm" variant="outline">
                  Monthly
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <LineChart className="aspect-[9/4]" />
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-6 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Inventory</CardTitle>
            <Button size="sm" variant="outline">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Make</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Reg. No.</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Toyota</TableCell>
                  <TableCell>Camry</TableCell>
                  <TableCell>2020</TableCell>
                  <TableCell>ABC123</TableCell>
                  <TableCell>
                    <Badge variant="outline">Available</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Honda</TableCell>
                  <TableCell>Civic</TableCell>
                  <TableCell>2018</TableCell>
                  <TableCell>DEF456</TableCell>
                  <TableCell>
                    <Badge variant="secondary">Rented</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Ford</TableCell>
                  <TableCell>Mustang</TableCell>
                  <TableCell>2021</TableCell>
                  <TableCell>GHI789</TableCell>
                  <TableCell>
                    <Badge variant="destructive">Maintenance</Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Maintenance Schedule</CardTitle>
            <Button size="sm" variant="outline">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Next Service</TableHead>
                  <TableHead>Last Service</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Toyota Camry</TableCell>
                  <TableCell>2023-06-15</TableCell>
                  <TableCell>2023-03-01</TableCell>
                  <TableCell>
                    <Badge variant="destructive">Due Soon</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Honda Civic</TableCell>
                  <TableCell>2023-08-01</TableCell>
                  <TableCell>2023-04-20</TableCell>
                  <TableCell>
                    <Badge variant="outline">Up to Date</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Ford Mustang</TableCell>
                  <TableCell>2023-05-01</TableCell>
                  <TableCell>2023-01-15</TableCell>
                  <TableCell>
                    <Badge variant="secondary">Overdue</Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Current Bookings</CardTitle>
            <Button size="sm" variant="outline">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Rental Period</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>John Doe</TableCell>
                  <TableCell>Toyota Camry</TableCell>
                  <TableCell>2023-05-01 - 2023-05-08</TableCell>
                  <TableCell>
                    <Badge variant="outline">Active</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Jane Smith</TableCell>
                  <TableCell>Honda Civic</TableCell>
                  <TableCell>2023-05-10 - 2023-05-15</TableCell>
                  <TableCell>
                    <Badge variant="outline">Active</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Michael Johnson</TableCell>
                  <TableCell>Ford Mustang</TableCell>
                  <TableCell>2023-05-20 - 2023-05-25</TableCell>
                  <TableCell>
                    <Badge variant="outline">Active</Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-6 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Booking Calendar</CardTitle>
            <Button size="sm" variant="outline">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <Calendar className="w-full" mode="range" />
          </CardContent>
        </Card>
        <div className="col-span-1 md:col-span-2 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>New Booking</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="grid gap-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customer-name">Customer Name</Label>
                    <Input id="customer-name" placeholder="Enter customer name" />
                  </div>
                  <div>
                    <Label htmlFor="customer-phone">Customer Phone</Label>
                    <Input id="customer-phone" placeholder="Enter customer phone" />
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="vehicle">Vehicle</Label>
                    <Select>
                      <option value="">Select a vehicle</option>
                      <option value="toyota-camry">Toyota Camry</option>
                      <option value="honda-civic">Honda Civic</option>
                      <option value="ford-mustang">Ford Mustang</option>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input id="start-date" type="date" />
                  </div>
                  <div>
                    <Label htmlFor="end-date">End Date</Label>
                    <Input id="end-date" type="date" />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="total-price">Total Price</Label>
                    <Input id="total-price" type="number" />
                  </div>
                  <div className="flex items-end">
                    <Button className="w-full" size="lg" type="submit">
                      Create Booking
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-6 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Customer List</CardTitle>
            <Button size="sm" variant="outline">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Rentals</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>John Doe</TableCell>
                  <TableCell>555-1234</TableCell>
                  <TableCell>12</TableCell>
                  <TableCell>
                    <Badge variant="outline">Active</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Jane Smith</TableCell>
                  <TableCell>555-5678</TableCell>
                  <TableCell>8</TableCell>
                  <TableCell>
                    <Badge variant="outline">Active</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Michael Johnson</TableCell>
                  <TableCell>555-9012</TableCell>
                  <TableCell>5</TableCell>
                  <TableCell>
                    <Badge variant="secondary">Inactive</Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Customer Profile</CardTitle>
            <Button size="sm" variant="outline">
              Edit
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex items-center gap-4">
                <div>
                  <h3 className="font-semibold">John Doe</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">johndoe@example.com</p>
                </div>
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <span>Phone:</span>
                  <span>555-1234</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Rentals:</span>
                  <span>12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Status:</span>
                  <Badge variant="outline">Active</Badge>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Rental History</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Rental Period</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Toyota Camry</TableCell>
                      <TableCell>2023-05-01 - 2023-05-08</TableCell>
                      <TableCell>$350</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Honda Civic</TableCell>
                      <TableCell>2023-03-15 - 2023-03-22</TableCell>
                      <TableCell>$300</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Ford Mustang</TableCell>
                      <TableCell>2022-11-01 - 2022-11-07</TableCell>
                      <TableCell>$450</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

function CarIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
      <circle cx="7" cy="17" r="2" />
      <path d="M9 17h6" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  )
}


function DollarSignIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  )
}


function LineChart(props: any) {
  return (
    <div {...props}>
      <ResponsiveLine
        data={[
          {
            id: "Desktop",
            data: [
              { x: "Jan", y: 43 },
              { x: "Feb", y: 137 },
              { x: "Mar", y: 61 },
              { x: "Apr", y: 145 },
              { x: "May", y: 26 },
              { x: "Jun", y: 154 },
            ],
          },
          {
            id: "Mobile",
            data: [
              { x: "Jan", y: 60 },
              { x: "Feb", y: 48 },
              { x: "Mar", y: 177 },
              { x: "Apr", y: 78 },
              { x: "May", y: 96 },
              { x: "Jun", y: 204 },
            ],
          },
        ]}
        margin={{ top: 10, right: 10, bottom: 40, left: 40 }}
        xScale={{
          type: "point",
        }}
        yScale={{
          type: "linear",
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 0,
          tickPadding: 16,
        }}
        axisLeft={{
          tickSize: 0,
          tickValues: 5,
          tickPadding: 16,
        }}
        colors={["#2563eb", "#e11d48"]}
        pointSize={6}
        useMesh={true}
        gridYValues={6}
        theme={{
          tooltip: {
            chip: {
              borderRadius: "9999px",
            },
            container: {
              fontSize: "12px",
              textTransform: "capitalize",
              borderRadius: "6px",
            },
          },
          grid: {
            line: {
              stroke: "#f3f4f6",
            },
          },
        }}
        role="application"
      />
    </div>
  )
}


function WrenchIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  )
}