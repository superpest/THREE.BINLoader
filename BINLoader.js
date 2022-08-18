
import {
	BufferGeometry,
	FileLoader,
	Float32BufferAttribute,
	Loader,
	Points,
	PointsMaterial
} from 'three';
class BINLoader extends Loader {
	constructor(manager) {
		super(manager);
		this.littleEndian = true;
	}

	load(url, onLoad, onProgress, onError) {
		const scope = this;
		const loader = new FileLoader(scope.manager);
		loader.setPath(scope.path);
		loader.setResponseType('arraybuffer');
		loader.setRequestHeader(scope.requestHeader);
		loader.setWithCredentials(scope.withCredentials);
		loader.load(url, function (data) {
			try {
				onLoad(scope.parse(data, url));
			} catch (e) {
				if (onError) {
					onError(e);
				} else {
					console.error(e);
				}
				scope.manager.itemError(url);
			}

		}, onProgress, onError);
	}
	parse(data, url) {

		const position = [];
		const dataview = new DataView(data);
		let offset = 0;
		let len = dataview.byteLength / 4
		for (let i = 0; i < len; i += 4) {
			position.push(dataview.getFloat32(offset, true));
			offset += 4;
			position.push(dataview.getFloat32(offset, true));
			offset += 4;
			position.push(dataview.getFloat32(offset, true));
			offset += 8;
		}


		const geometry = new BufferGeometry();
		if (position.length > 0) geometry.setAttribute('position', new Float32BufferAttribute(position, 3));

		geometry.computeBoundingSphere();

		const material = new PointsMaterial({
			size: 0.005
		});

		material.color.setHex(Math.random() * 0xffffff);

		const mesh = new Points(geometry, material);
		let name = url.split('').reverse().join('');
		name = /([^\/]*)/.exec(name);
		name = name[1].split('').reverse().join('');
		mesh.name = name;
		return mesh;

	}

}
export { BINLoader };
