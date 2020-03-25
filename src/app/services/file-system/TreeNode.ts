class TreeNode {
    private value: any = null;
    private children: TreeNode[] = [];

    constructor(value: any, children?: TreeNode[]) {
        this.value = value;
        if(children) { this.children = children; }
    }

    public getValue(): any {
        return this.value;
    }

    public getChildren(): TreeNode[] {
        return this.children
    }

    /** Given a value of a child, add them along with other children 
     * @param childValue The value of the child to add
    */
    public addChild(childValue: any): void {
        let newNode = new TreeNode(childValue);
        this.addChildNode(newNode);
    }

    /** Add a node to the tree
     * @param child The new child to add
     */
    public addChildNode(child: TreeNode): void {
        this.children.push(child);
    }

    /** Removes all instances of a child with given value from the set of children using "===" comparison.
     * @param childValue The value of the child to remove
     */
    public removeChild(childValue: any): void {
        this.children = this.children.filter((elem: TreeNode) => {elem.value !== childValue})
    }
}