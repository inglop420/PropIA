
'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Upload, X } from "lucide-react";
import toast from "react-hot-toast";

const TIPOS_PROPIEDAD = [
  "Casa",
  "Departamento",
  "Terreno",
  "Local comercial",
  "Oficina",
  "Bodega",
  "Rancho",
  "Condominio",
  "Penthouse",
  "Loft"
];

const AMENIDADES_COMUNES = [
  "Alberca",
  "Gimnasio",
  "Jardín",
  "Seguridad 24/7",
  "Estacionamiento techado",
  "Elevador",
  "Balcón",
  "Terraza",
  "Cocina integral",
  "Aire acondicionado",
  "Calefacción",
  "Amueblado",
];

export function PropertyForm({ propiedadId }: { propiedadId?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    precio: "",
    ciudad: "",
    estado: "Jalisco",
    colonia: "",
    tipo: "Casa",
    superficie: "",
    habitaciones: "",
    banos: "",
    estacionamiento: "",
    plantas: "1",
    amenidades: [] as string[],
    imagenes: [] as string[],
  });

  const handleAmenidadToggle = (amenidad: string) => {
    setFormData((prev) => ({
      ...prev,
      amenidades: prev.amenidades.includes(amenidad)
        ? prev.amenidades.filter((a) => a !== amenidad)
        : [...prev.amenidades, amenidad],
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      const uploadedImages: string[] = [];

      for (let i = 0; i < Math.min(files.length, 15); i++) {
        const file = files[i];
        const formDataUpload = new FormData();
        formDataUpload.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formDataUpload,
        });

        if (response.ok) {
          const data = await response.json();
          uploadedImages.push(data?.cloud_storage_path);
        }
      }

      setFormData((prev) => ({
        ...prev,
        imagenes: [...prev.imagenes, ...uploadedImages].slice(0, 15),
      }));

      toast.success(`${uploadedImages.length} imágenes subidas`);
    } catch (error) {
      toast.error("Error al subir imágenes");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      imagenes: prev.imagenes.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.imagenes.length < 5) {
      toast.error("Debes subir al menos 5 imágenes");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/propiedades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Propiedad creada exitosamente");
        router.push("/dashboard/propiedades");
      } else {
        toast.error("Error al crear propiedad");
      }
    } catch (error) {
      toast.error("Error al crear propiedad");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 border border-[#D7CCC8]">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Título */}
        <div className="md:col-span-2">
          <Label htmlFor="titulo" className="text-[#5D4037]">Título *</Label>
          <Input
            id="titulo"
            value={formData.titulo}
            onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
            required
            className="border-[#D7CCC8]"
            placeholder="Casa moderna en zona premium"
          />
        </div>

        {/* Descripción */}
        <div className="md:col-span-2">
          <Label htmlFor="descripcion" className="text-[#5D4037]">Descripción *</Label>
          <Textarea
            id="descripcion"
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            required
            rows={4}
            className="border-[#D7CCC8]"
            placeholder="Describe la propiedad en detalle..."
          />
        </div>

        {/* Precio */}
        <div>
          <Label htmlFor="precio" className="text-[#5D4037]">Precio *</Label>
          <Input
            id="precio"
            type="number"
            value={formData.precio}
            onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
            required
            className="border-[#D7CCC8]"
            placeholder="5000000"
          />
        </div>

        {/* Tipo */}
        <div>
          <Label htmlFor="tipo" className="text-[#5D4037]">Tipo *</Label>
          <Select value={formData.tipo} onValueChange={(value) => setFormData({ ...formData, tipo: value })}>
            <SelectTrigger className="border-[#D7CCC8]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIPOS_PROPIEDAD.map((tipo) => (
                <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Ciudad */}
        <div>
          <Label htmlFor="ciudad" className="text-[#5D4037]">Ciudad *</Label>
          <Input
            id="ciudad"
            value={formData.ciudad}
            onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
            required
            className="border-[#D7CCC8]"
            placeholder="Guadalajara"
          />
        </div>

        {/* Estado */}
        <div>
          <Label htmlFor="estado" className="text-[#5D4037]">Estado *</Label>
          <Input
            id="estado"
            value={formData.estado}
            onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
            required
            className="border-[#D7CCC8]"
            placeholder="Jalisco"
          />
        </div>

        {/* Colonia */}
        <div>
          <Label htmlFor="colonia" className="text-[#5D4037]">Colonia/Zona *</Label>
          <Input
            id="colonia"
            value={formData.colonia}
            onChange={(e) => setFormData({ ...formData, colonia: e.target.value })}
            required
            className="border-[#D7CCC8]"
            placeholder="Providencia"
          />
        </div>

        {/* Superficie */}
        <div>
          <Label htmlFor="superficie" className="text-[#5D4037]">Superficie (m²) *</Label>
          <Input
            id="superficie"
            type="number"
            value={formData.superficie}
            onChange={(e) => setFormData({ ...formData, superficie: e.target.value })}
            required
            className="border-[#D7CCC8]"
            placeholder="250"
          />
        </div>

        {/* Habitaciones */}
        <div>
          <Label htmlFor="habitaciones" className="text-[#5D4037]">Habitaciones *</Label>
          <Input
            id="habitaciones"
            type="number"
            value={formData.habitaciones}
            onChange={(e) => setFormData({ ...formData, habitaciones: e.target.value })}
            required
            className="border-[#D7CCC8]"
            placeholder="3"
          />
        </div>

        {/* Baños */}
        <div>
          <Label htmlFor="banos" className="text-[#5D4037]">Baños *</Label>
          <Input
            id="banos"
            type="number"
            value={formData.banos}
            onChange={(e) => setFormData({ ...formData, banos: e.target.value })}
            required
            className="border-[#D7CCC8]"
            placeholder="2"
          />
        </div>

        {/* Estacionamiento */}
        <div>
          <Label htmlFor="estacionamiento" className="text-[#5D4037]">Estacionamiento *</Label>
          <Input
            id="estacionamiento"
            type="number"
            value={formData.estacionamiento}
            onChange={(e) => setFormData({ ...formData, estacionamiento: e.target.value })}
            required
            className="border-[#D7CCC8]"
            placeholder="2"
          />
        </div>

        {/* Plantas */}
        <div>
          <Label htmlFor="plantas" className="text-[#5D4037]">Plantas/Pisos *</Label>
          <Input
            id="plantas"
            type="number"
            value={formData.plantas}
            onChange={(e) => setFormData({ ...formData, plantas: e.target.value })}
            required
            className="border-[#D7CCC8]"
            placeholder="1"
          />
        </div>

        {/* Amenidades */}
        <div className="md:col-span-2">
          <Label className="text-[#5D4037] mb-3 block">Amenidades</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {AMENIDADES_COMUNES.map((amenidad) => (
              <label key={amenidad} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.amenidades.includes(amenidad)}
                  onChange={() => handleAmenidadToggle(amenidad)}
                  className="w-4 h-4 text-[#5D4037] border-[#D7CCC8] rounded focus:ring-[#5D4037]"
                />
                <span className="text-sm text-[#6D4C41]">{amenidad}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Imágenes */}
        <div className="md:col-span-2">
          <Label className="text-[#5D4037] mb-3 block">
            Imágenes * (Mínimo 5, Máximo 15)
          </Label>
          
          <div className="mb-4">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
              disabled={uploading || formData.imagenes.length >= 15}
            />
            <label htmlFor="image-upload">
              <Button
                type="button"
                disabled={uploading || formData.imagenes.length >= 15}
                className="bg-[#5D4037] hover:bg-[#3E2723] text-white cursor-pointer"
                onClick={() => document.getElementById("image-upload")?.click()}
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Subiendo...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Subir Imágenes ({formData.imagenes.length}/15)
                  </>
                )}
              </Button>
            </label>
          </div>

          {formData.imagenes.length > 0 && (
            <div className="grid grid-cols-5 gap-3">
              {formData.imagenes.map((_, index) => (
                <div key={index} className="relative aspect-video bg-[#D7CCC8] rounded border border-[#5D4037]">
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="w-full h-full flex items-center justify-center text-[#5D4037]">
                    Imagen {index + 1}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={loading || uploading || formData.imagenes.length < 5}
          className="bg-[#5D4037] hover:bg-[#3E2723] text-white"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creando...
            </>
          ) : (
            "Crear Propiedad"
          )}
        </Button>
      </div>
    </form>
  );
}
