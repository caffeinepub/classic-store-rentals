import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@tanstack/react-router";
import {
  ChevronRight,
  Mail,
  MessageCircle,
  MonitorPlay,
  Phone,
  Speaker,
  Star,
  Tv2,
  Volume2,
} from "lucide-react";
import { Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "../backend.d";
import { useGetProducts, useSubmitBooking } from "../hooks/useQueries";

const STATIC_PRODUCTS = [
  {
    id: "projector",
    name: "Projector",
    description:
      "HD/4K projectors for meetings, events & presentations. Crystal clear image quality.",
    pricePerDay: BigInt(999),
    category: "AV",
    image: "/assets/generated/product-projector.dim_400x300.jpg",
    icon: MonitorPlay,
  },
  {
    id: "led-tv",
    name: "LED TV",
    description:
      '32" to 75" smart LED TVs available. Perfect for hotels, homes & events.',
    pricePerDay: BigInt(799),
    category: "Display",
    image: "/assets/generated/product-led-tv.dim_400x300.jpg",
    icon: Tv2,
  },
  {
    id: "speakers",
    name: "Speakers",
    description:
      "Party & conference speakers with powerful bass. Indoor & outdoor ready.",
    pricePerDay: BigInt(499),
    category: "Audio",
    image: "/assets/generated/product-speakers.dim_400x300.jpg",
    icon: Speaker,
  },
  {
    id: "sound-system",
    name: "Sound System",
    description:
      "Complete indoor/outdoor sound setup with subwoofer, speakers & mixer.",
    pricePerDay: BigInt(1499),
    category: "Audio",
    image: "/assets/generated/product-sound-system.dim_400x300.jpg",
    icon: Volume2,
  },
];

function ProductCard({
  product,
  image,
  onBook,
}: { product: Product; image?: string; onBook: () => void }) {
  const icons: Record<string, React.ElementType> = {
    projector: MonitorPlay,
    "led-tv": Tv2,
    speakers: Speaker,
    "sound-system": Volume2,
  };
  const Icon = icons[product.id] ?? Star;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Card className="card-hover shadow-card overflow-hidden h-full flex flex-col">
        <div className="relative h-48 bg-muted overflow-hidden">
          {image ? (
            <img
              src={image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
              <Icon className="w-16 h-16 text-primary/40" />
            </div>
          )}
        </div>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-display">{product.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-between gap-4">
          <p className="text-muted-foreground text-sm leading-relaxed">
            {product.description}
          </p>
          <Button
            className="btn-green w-full"
            onClick={onBook}
            data-ocid="products.book_now.button"
          >
            Book Now
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function PricingCard({
  product,
  index,
  onBook,
}: { product: Product; index: number; onBook: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="card-hover shadow-card text-center h-full flex flex-col">
        <CardHeader>
          <CardTitle className="text-xl font-display">{product.name}</CardTitle>
          <div className="mt-2">
            <span className="text-4xl font-bold text-primary font-display">
              ₹{product.pricePerDay.toString()}
            </span>
            <span className="text-muted-foreground text-sm">/day</span>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-end">
          <p className="text-muted-foreground text-sm mb-4">
            {product.description}
          </p>
          <Button
            className="btn-green w-full"
            onClick={onBook}
            data-ocid="pricing.book_now.button"
          >
            Book Now
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function BookingForm({ products }: { products: Product[] }) {
  const submitBooking = useSubmitBooking();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    equipment: "",
    startDate: "",
    endDate: "",
    address: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.name ||
      !form.phone ||
      !form.equipment ||
      !form.startDate ||
      !form.endDate ||
      !form.address
    ) {
      toast.error("Please fill in all fields.");
      return;
    }
    try {
      await submitBooking.mutateAsync({
        id: Date.now().toString(),
        customerName: form.name,
        phone: form.phone,
        equipment: form.equipment,
        startDate: form.startDate,
        endDate: form.endDate,
        address: form.address,
        submittedAt: BigInt(Date.now()),
      });
      toast.success(
        "Booking submitted successfully! We'll contact you shortly.",
      );
      setForm({
        name: "",
        phone: "",
        equipment: "",
        startDate: "",
        endDate: "",
        address: "",
      });
    } catch {
      toast.error("Failed to submit booking. Please try again.");
    }
  };

  const displayProducts = products.length > 0 ? products : STATIC_PRODUCTS;

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
      data-ocid="booking.form"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="booking-name">Full Name</Label>
          <Input
            id="booking-name"
            placeholder="Your name"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            data-ocid="booking.name.input"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="booking-phone">Phone Number</Label>
          <Input
            id="booking-phone"
            placeholder="+91 XXXXXXXXXX"
            value={form.phone}
            onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
            data-ocid="booking.phone.input"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="booking-equipment">Equipment Required</Label>
        <Select
          value={form.equipment}
          onValueChange={(v) => setForm((p) => ({ ...p, equipment: v }))}
        >
          <SelectTrigger
            id="booking-equipment"
            data-ocid="booking.equipment.select"
          >
            <SelectValue placeholder="Select equipment" />
          </SelectTrigger>
          <SelectContent>
            {displayProducts.map((p) => (
              <SelectItem key={p.id} value={p.name}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="booking-start">Rental Start Date</Label>
          <Input
            id="booking-start"
            type="date"
            value={form.startDate}
            onChange={(e) =>
              setForm((p) => ({ ...p, startDate: e.target.value }))
            }
            data-ocid="booking.start_date.input"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="booking-end">Rental End Date</Label>
          <Input
            id="booking-end"
            type="date"
            value={form.endDate}
            onChange={(e) =>
              setForm((p) => ({ ...p, endDate: e.target.value }))
            }
            data-ocid="booking.end_date.input"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="booking-address">Delivery Address</Label>
        <Textarea
          id="booking-address"
          placeholder="Full delivery address"
          rows={3}
          value={form.address}
          onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
          data-ocid="booking.address.textarea"
        />
      </div>
      <Button
        type="submit"
        className="btn-green w-full"
        disabled={submitBooking.isPending}
        data-ocid="booking.submit.button"
      >
        {submitBooking.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit Booking"
        )}
      </Button>
    </form>
  );
}

export default function HomePage() {
  const { data: backendProducts = [] } = useGetProducts();
  const displayProducts =
    backendProducts.length > 0 ? backendProducts : STATIC_PRODUCTS;

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header
        className="sticky top-0 z-50 bg-navy shadow-md"
        style={{ backgroundColor: "oklch(0.13 0.03 260)" }}
        data-ocid="nav.section"
      >
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-between h-16 md:h-18">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 hero-gradient rounded-lg flex items-center justify-center">
                <Volume2 className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-display font-bold text-xl">
                Classic Store
              </span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              {["Home", "Products", "Pricing", "Booking", "Contact"].map(
                (item) => (
                  <button
                    type="button"
                    key={item}
                    onClick={() => scrollToSection(item.toLowerCase())}
                    className="nav-link text-sm"
                    data-ocid={`nav.${item.toLowerCase()}.link`}
                  >
                    {item}
                  </button>
                ),
              )}
            </nav>
            <div className="flex items-center gap-3">
              <Button
                className="btn-green text-sm px-4 py-2"
                onClick={() => scrollToSection("booking")}
                data-ocid="nav.book_now.button"
              >
                Book Now
              </Button>
              <Link
                to="/admin"
                className="text-slate-400 hover:text-white text-sm transition-colors"
                data-ocid="nav.admin.link"
              >
                Admin
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section id="home" className="hero-gradient py-24 md:py-36">
          <div className="container mx-auto px-4 max-w-6xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <h1 className="text-4xl md:text-6xl font-display font-extrabold text-white mb-4 leading-tight">
                Premium Electronics
                <br />
                on Rent
              </h1>
              <p className="text-white/80 text-lg md:text-xl mb-8 font-sans">
                Projectors &bull; TVs &bull; Speakers &bull; Sound Systems
              </p>
              <Button
                className="btn-green text-base px-8 py-3 text-lg"
                onClick={() => scrollToSection("booking")}
                data-ocid="hero.book_equipment.button"
              >
                Book Equipment <ChevronRight className="ml-1 h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Products Section */}
        <section id="products" className="py-20 bg-background">
          <div className="container mx-auto px-4 max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
                Our Products
              </h2>
              <p className="text-muted-foreground">
                Top-quality electronics available for rent
              </p>
            </motion.div>
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              data-ocid="products.list"
            >
              {displayProducts.map((product, i) => {
                const staticProduct = STATIC_PRODUCTS.find(
                  (sp) => sp.id === product.id || sp.name === product.name,
                );
                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    image={staticProduct?.image}
                    onBook={() => scrollToSection("booking")}
                    data-ocid={`products.item.${i + 1}`}
                  />
                );
              })}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section
          id="pricing"
          className="py-20"
          style={{ backgroundColor: "oklch(0.955 0.012 240)" }}
        >
          <div className="container mx-auto px-4 max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
                Rental Pricing
              </h2>
              <p className="text-muted-foreground">
                Affordable rates for every need
              </p>
            </motion.div>
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              data-ocid="pricing.list"
            >
              {displayProducts.map((product, i) => (
                <PricingCard
                  key={product.id}
                  product={product}
                  index={i}
                  onBook={() => scrollToSection("booking")}
                  data-ocid={`pricing.item.${i + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Booking + Contact Section */}
        <section id="booking" className="py-20 bg-background">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Booking Form */}
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl font-display font-bold mb-2">
                  Book Equipment
                </h2>
                <p className="text-muted-foreground mb-6">
                  Fill in the form and we'll confirm your booking.
                </p>
                <Card className="shadow-card">
                  <CardContent className="pt-6">
                    <BookingForm products={backendProducts} />
                  </CardContent>
                </Card>
              </motion.div>

              {/* Contact Section */}
              <motion.div
                id="contact"
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl font-display font-bold mb-2">
                  Contact Us
                </h2>
                <p className="text-muted-foreground mb-6">
                  Get in touch for any queries or bookings.
                </p>
                <div className="contact-gradient rounded-2xl p-8 space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white/70 text-sm font-medium mb-1">
                        Phone
                      </p>
                      <p className="text-white font-semibold text-lg">
                        +91-9876543210
                      </p>
                      <p className="text-white/70 text-sm">Mon–Sat, 9am–7pm</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white/70 text-sm font-medium mb-1">
                        WhatsApp
                      </p>
                      <a
                        href="https://wa.me/919876543210"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white font-semibold text-lg hover:underline"
                        data-ocid="contact.whatsapp.link"
                      >
                        Chat on WhatsApp
                      </a>
                      <p className="text-white/70 text-sm">
                        Quick response guaranteed
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white/70 text-sm font-medium mb-1">
                        Email
                      </p>
                      <a
                        href="mailto:info@classicstore.in"
                        className="text-white font-semibold text-lg hover:underline"
                        data-ocid="contact.email.link"
                      >
                        info@classicstore.in
                      </a>
                      <p className="text-white/70 text-sm">
                        We reply within 24 hours
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        style={{ backgroundColor: "oklch(0.13 0.03 260)" }}
        className="py-8"
      >
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 hero-gradient rounded-lg flex items-center justify-center">
                <Volume2 className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-white font-display font-bold">
                Classic Store
              </span>
            </div>
            <p className="text-slate-400 text-sm">
              © {new Date().getFullYear()} Classic Store. All rights reserved.
            </p>
            <p className="text-slate-500 text-xs">
              Built with ♥ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
