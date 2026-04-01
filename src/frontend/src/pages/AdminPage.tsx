import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Loader2,
  LogOut,
  Pencil,
  Plus,
  Trash2,
  Volume2,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "../backend.d";
import {
  useAddProduct,
  useDeleteProduct,
  useGetAllBookings,
  useGetProducts,
  useUpdateProduct,
} from "../hooks/useQueries";

const ADMIN_PASSWORD = "admin123";

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      onLogin();
    } else {
      setError("Incorrect password. Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.52 0.26 264), oklch(0.68 0.15 200))",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Card
          className="w-full max-w-md mx-4 shadow-2xl"
          data-ocid="admin.login.modal"
        >
          <CardHeader className="text-center pb-2">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.52 0.26 264), oklch(0.68 0.15 200))",
              }}
            >
              <Volume2 className="w-7 h-7 text-white" />
            </div>
            <CardTitle className="text-2xl font-display">Admin Panel</CardTitle>
            <p className="text-muted-foreground text-sm">
              Classic Store Management
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="admin-password">Password</Label>
                <Input
                  id="admin-password"
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  data-ocid="admin.password.input"
                />
                {error && (
                  <p
                    className="text-destructive text-sm"
                    data-ocid="admin.password.error_state"
                  >
                    {error}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="btn-green w-full"
                data-ocid="admin.login.submit_button"
              >
                Login
              </Button>
            </form>
            <div className="mt-4 text-center">
              <Link
                to="/"
                className="text-sm text-muted-foreground hover:text-foreground flex items-center justify-center gap-1"
                data-ocid="admin.back.link"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to site
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function BookingsTab() {
  const { data: bookings = [], isLoading } = useGetAllBookings();

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center py-16"
        data-ocid="bookings.loading_state"
      >
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div
        className="text-center py-16 text-muted-foreground"
        data-ocid="bookings.empty_state"
      >
        <p className="text-lg font-medium">No bookings yet</p>
        <p className="text-sm">
          Bookings will appear here once customers submit the form.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto" data-ocid="bookings.table">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Equipment</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Submitted</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking, i) => (
            <TableRow key={booking.id} data-ocid={`bookings.item.${i + 1}`}>
              <TableCell className="font-medium">
                {booking.customerName}
              </TableCell>
              <TableCell>{booking.phone}</TableCell>
              <TableCell>
                <Badge variant="secondary">{booking.equipment}</Badge>
              </TableCell>
              <TableCell>{booking.startDate}</TableCell>
              <TableCell>{booking.endDate}</TableCell>
              <TableCell className="max-w-[200px] truncate">
                {booking.address}
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {new Date(Number(booking.submittedAt)).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

const EMPTY_PRODUCT: Omit<Product, "id"> = {
  name: "",
  description: "",
  pricePerDay: BigInt(0),
  category: "",
};

function ManageProductsTab() {
  const { data: products = [], isLoading } = useGetProducts();
  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Omit<Product, "id">>(EMPTY_PRODUCT);

  const openAdd = () => {
    setFormData(EMPTY_PRODUCT);
    setShowAddDialog(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      pricePerDay: product.pricePerDay,
      category: product.category,
    });
  };

  const handleSaveAdd = async () => {
    if (!formData.name.trim()) {
      toast.error("Product name is required");
      return;
    }
    try {
      await addProduct.mutateAsync({ ...formData, id: Date.now().toString() });
      toast.success("Product added successfully");
      setShowAddDialog(false);
    } catch {
      toast.error("Failed to add product");
    }
  };

  const handleSaveEdit = async () => {
    if (!editingProduct || !formData.name.trim()) return;
    try {
      await updateProduct.mutateAsync({ ...formData, id: editingProduct.id });
      toast.success("Product updated");
      setEditingProduct(null);
    } catch {
      toast.error("Failed to update product");
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct.mutateAsync(productId);
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete product");
    }
  };

  const ProductFormFields = () => (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label>Name</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
          placeholder="Product name"
          data-ocid="manage.product.name.input"
        />
      </div>
      <div className="space-y-1.5">
        <Label>Description</Label>
        <Textarea
          value={formData.description}
          onChange={(e) =>
            setFormData((p) => ({ ...p, description: e.target.value }))
          }
          placeholder="Product description"
          rows={2}
          data-ocid="manage.product.description.textarea"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Price per Day (₹)</Label>
          <Input
            type="number"
            value={formData.pricePerDay.toString()}
            onChange={(e) =>
              setFormData((p) => ({
                ...p,
                pricePerDay: BigInt(e.target.value || 0),
              }))
            }
            placeholder="999"
            data-ocid="manage.product.price.input"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Category</Label>
          <Input
            value={formData.category}
            onChange={(e) =>
              setFormData((p) => ({ ...p, category: e.target.value }))
            }
            placeholder="AV, Audio, Display..."
            data-ocid="manage.product.category.input"
          />
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center py-16"
        data-ocid="manage.loading_state"
      >
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-muted-foreground text-sm">
          {products.length} product{products.length !== 1 ? "s" : ""}
        </p>
        <Button
          className="btn-green"
          onClick={openAdd}
          data-ocid="manage.add_product.button"
        >
          <Plus className="w-4 h-4 mr-1" /> Add Product
        </Button>
      </div>

      {products.length === 0 ? (
        <div
          className="text-center py-16 text-muted-foreground"
          data-ocid="manage.products.empty_state"
        >
          <p className="text-lg font-medium">No products yet</p>
          <p className="text-sm">
            Add your first product using the button above.
          </p>
        </div>
      ) : (
        <div className="space-y-3" data-ocid="manage.products.list">
          {products.map((product, i) => (
            <Card key={product.id} data-ocid={`manage.product.item.${i + 1}`}>
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{product.name}</p>
                    <Badge variant="outline" className="text-xs">
                      {product.category}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm mt-0.5 line-clamp-1">
                    {product.description}
                  </p>
                  <p className="text-primary font-bold text-sm mt-1">
                    ₹{product.pricePerDay.toString()}/day
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEdit(product)}
                    data-ocid={`manage.product.edit_button.${i + 1}`}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(product.id)}
                    className="text-destructive hover:bg-destructive hover:text-white"
                    data-ocid={`manage.product.delete_button.${i + 1}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent data-ocid="manage.add_product.dialog">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
          </DialogHeader>
          <ProductFormFields />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddDialog(false)}
              data-ocid="manage.add_product.cancel_button"
            >
              Cancel
            </Button>
            <Button
              className="btn-green"
              onClick={handleSaveAdd}
              disabled={addProduct.isPending}
              data-ocid="manage.add_product.confirm_button"
            >
              {addProduct.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Add Product"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingProduct}
        onOpenChange={(open) => {
          if (!open) setEditingProduct(null);
        }}
      >
        <DialogContent data-ocid="manage.edit_product.dialog">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <ProductFormFields />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditingProduct(null)}
              data-ocid="manage.edit_product.cancel_button"
            >
              Cancel
            </Button>
            <Button
              className="btn-green"
              onClick={handleSaveEdit}
              disabled={updateProduct.isPending}
              data-ocid="manage.edit_product.confirm_button"
            >
              {updateProduct.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Navbar */}
      <header
        style={{ backgroundColor: "oklch(0.13 0.03 260)" }}
        className="shadow-md"
      >
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.52 0.26 264), oklch(0.68 0.15 200))",
                }}
              >
                <Volume2 className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-display font-bold text-xl">
                Classic Store
              </span>
              <span className="text-slate-400 text-sm ml-1">/ Admin</span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="text-slate-400 hover:text-white text-sm flex items-center gap-1 transition-colors"
                data-ocid="admin.nav.home.link"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to site
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAuthenticated(false)}
                className="text-slate-300 border-slate-600 hover:bg-slate-700"
                data-ocid="admin.logout.button"
              >
                <LogOut className="w-3.5 h-3.5 mr-1" /> Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <main className="container mx-auto px-4 max-w-6xl py-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-display font-bold mb-8">
            Management Panel
          </h1>
          <Tabs defaultValue="bookings">
            <TabsList className="mb-8">
              <TabsTrigger value="bookings" data-ocid="admin.bookings.tab">
                Bookings
              </TabsTrigger>
              <TabsTrigger value="products" data-ocid="admin.products.tab">
                Manage Products
              </TabsTrigger>
            </TabsList>
            <TabsContent value="bookings">
              <Card>
                <CardHeader>
                  <CardTitle>All Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <BookingsTab />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="products">
              <Card>
                <CardHeader>
                  <CardTitle>Products & Pricing</CardTitle>
                </CardHeader>
                <CardContent>
                  <ManageProductsTab />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
}
