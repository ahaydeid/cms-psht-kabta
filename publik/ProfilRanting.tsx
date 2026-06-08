import { PublicPagePlaceholder } from './components/common/PublicPagePlaceholder';
import { PublicLayout } from './components/layout/PublicLayout';
import { Head } from './runtime/inertia-shim';

export default function ProfilRanting() {
    return (
        <PublicLayout>
            <Head title="Ranting" />
            <PublicPagePlaceholder title="Ranting" />
        </PublicLayout>
    );
}
