---
title: Home Page
---
Apparently this is my home page

```cs
using System;
using System.Collections;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Security.AccessControl;
using System.Security.Principal;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Net.Http;
using Syncfusion.Windows.Forms;
using Syncfusion.Windows.Forms.Tools;
using Syncfusion.Windows.Forms.Tools.MultiColumnTreeView;
using TreeNodeAdv = Syncfusion.Windows.Forms.Tools.MultiColumnTreeView.TreeNodeAdv;


namespace GDPRAccessChecker
{
    public partial class PermissionBrowser : MetroForm
    {
        private DomainMap _domainMap;

        private int _domainObjectsLoaded;
        private string[] Args { get; set; }

        public PermissionBrowser(string[] args)
        {
            InitializeComponent();
            Args = args;
            permissionTree.OwnerDrawNodes = true;
            permissionTree.BeforeNodePaint += PermissionTree_BeforeNodePaint;
        }

        private void PermissionTree_BeforeNodePaint(object sender, Syncfusion.Windows.Forms.Tools.MultiColumnTreeView.TreeNodeAdvPaintEventArgs e)
        {
            e.Node.Text = "test";
        }

        private async void AccessCheckerForm_Load(object sender, EventArgs e)
        {
            
            _domainObjectsLoaded = 0;

            if (File.Exists(@"DomainMap.dat"))
            {
                await Task.Run(() =>
                {
                    _domainMap = Utils.DataContractDeSerialize<DomainMap>(@"DomainMap.dat");
                    _domainMap.Initialise();
                    domainObjectsStatusCount.Text = _domainMap.DomainObjects.Count.ToString();
                });
            }
            else
            {
                MessageBox.Show(@"Creating domain map, this may take a while");

                _domainMap = new DomainMap();

                Progress<int> progressHandler = new Progress<int>(value =>
                {
                    _domainObjectsLoaded += value;
                    domainObjectsStatusCount.Text = _domainObjectsLoaded.ToString();
                });

                await Task.WhenAll(_domainMap.LoadDomainAsync("acs.uscoopers.com", progressHandler), _domainMap.LoadDomainAsync("americas.oneacs.com", progressHandler), _domainMap.LoadDomainAsync("hrs.acs-inc.corp", progressHandler));

                _domainMap.ReplaceMemberListDistinguishedNamesWithSids();
                Utils.DataContractSerialize(_domainMap, @"DomainMap.dat");
            }
        }

        private void button1_Click(object sender, EventArgs e)
        {
            _domainMap.CancelAllAsync();

        }

        private void loadPermissionsBtn_Click(object sender, EventArgs e)
        {
            if (_domainMap == null || _domainMap.DomainObjects.Count == 0)
            {
                return;
            }

            string directoryPath = folderPathTextBox.Text;

            ResetFormState();

            if (PopulateFileTree(directoryPath))
            {
                PopulatePermissionTree(directoryPath);
            }
        }

        private void ResetFormState()
        {
            fileTree.Nodes.Clear();
            permissionTree.Nodes.Clear();
        }

        private bool PopulateFileTree(string directoryPath)
        {
            bool includeSubDirectories = includeSubDirectoriesCheckBox.Checked;

            AddDirectoryToFileTree(directoryPath, includeSubDirectories);

            return true;

        }

        private void AddDirectoryToFileTree(string directoryPath, bool includeSubDirectories, TreeNode currentNode = null)
        {
            TreeNode directoryNode = new TreeNode(directoryPath);

            if (currentNode == null)
            {
                fileTree.Nodes.Add(directoryNode);
            }
            else
            {
                currentNode.Nodes.Add(directoryNode);
            }

            if (includeSubDirectories)
            {
                try
                {
                    foreach (string directory in Directory.GetDirectories(directoryPath))
                    {
                        AddDirectoryToFileTree(directory, false, directoryNode);
                    }
                }
                catch (UnauthorizedAccessException)
                {
                    TreeNode unauthNode = new TreeNode("Access denied....") { ImageIndex = 2, SelectedImageIndex = 2 };
                    directoryNode.Nodes.Add(unauthNode);
                }
            }


        }

        private void PopulatePermissionTree(string directoryPath)
        {
            try
            {
                DirectorySecurity dSecurity = Directory.GetAccessControl(directoryPath);

                foreach (FileSystemAccessRule rule in dSecurity.GetAccessRules(true, true, typeof(SecurityIdentifier)))
                {
                    FileSystemRights fsRights = rule.FileSystemRights;
                    IdentityReference identity = rule.IdentityReference;

                    // Check if sid of identify is in our domain map
                    if (_domainMap.DomainObjects.TryGetValue(identity.Value, out DomainObject domainObject))
                    {
                        // Add a root node for our domain if there isn't one
                        // TODO: write search extension method
                        TreeNodeAdv rootNode = null;
                        foreach (TreeNodeAdv node in permissionTree.Nodes)
                        {
                            if (node.Text == domainObject.VirtualPath.DomainComponent)
                            {
                                rootNode = node;
                                break;
                            }
                        }


                        if (rootNode == null)
                        {
                            rootNode = new PermissionTreeNode(domainObject.VirtualPath.DomainComponent);
                            permissionTree.Nodes.Add(rootNode);
                        }

                        // Create our new node
                        PermissionTreeNode newNode = new PermissionTreeNode(domainObject, fsRights.ToString());

                        if (domainObject.Type == DomainObjectType.Group)
                        {
                            AddGroupMembersToCurrentNode(newNode, domainObject, fsRights.ToString());
                        }

                        rootNode.Nodes.Add(newNode);
                    }
                    else
                    {
                        // SID entry not in our dictionary so add generic node
                        string unknownSidDomain = DomainMap.GetDomainOfSid(identity.Value);
                        string nodeName = identity.Value;

                        // Try and lookup domain portion of SID in our dictionary to see if we can point to correct domain
                        if (!string.IsNullOrEmpty(unknownSidDomain) && _domainMap.SidDomainLookup.TryGetValue(unknownSidDomain, out string domainName))
                            nodeName += $" ({domainName})";

                        TreeNodeAdv unknownNode = new TreeNodeAdv(nodeName) {LeftImageIndices = new int[] {5}};
                        unknownNode.SubItems.Add(new TreeNodeAdvSubItem(fsRights.ToString()));
                        permissionTree.Nodes.Add(unknownNode);

                    }

                }

                // Had to implement reciprocal function as SortWithChildNode doesn't work with comparer class
                permissionTree.Nodes.SortAll(new PermissionTreeNodeSorter());

                foreach (TreeNodeAdv node in permissionTree.Nodes)
                {
                    if (node is PermissionTreeNode treeNode)
                    {
                        if (treeNode.Type != DomainObjectType.Group)
                            node.Expand();
                    }
                }

                // Had to implement reciprocal function to autofit column width to content
                permissionTree.ColumnAutoWidth();
            }
            catch
            {
                permissionTree.Nodes.Add(new TreeNodeAdv("Error loading permissions.......") { LeftImageIndices = new int[] { 6 } });
            }
        }

        private void AddGroupMembersToCurrentNode(TreeNodeAdv currentNode, DomainObject domainObject, string rights = null)
        {
            if (domainObject.Group?.Members?.Count == 0)
            {
                return;
            }

            foreach (string memberSid in domainObject.Group.Members)
            {
                if (_domainMap.DomainObjects.TryGetValue(memberSid, out DomainObject memberObject))
                {
                    PermissionTreeNode memberNode = new PermissionTreeNode(memberObject, rights, true) { Font = new Font(permissionTree.Font, FontStyle.Italic) };

                    if (memberObject.Type == DomainObjectType.Group)
                    {
                        AddGroupMembersToCurrentNode(memberNode, memberObject, rights);
                    }

                    currentNode.Nodes.Add(memberNode);
                }
            }
        }

        private void fileTree_NodeMouseDoubleClick(object sender, TreeNodeMouseClickEventArgs e)
        {
            if (sender is TreeView && includeSubDirectoriesCheckBox.Checked && e.Node.Nodes.Count == 0)
            {

                try
                {
                    foreach (string directory in Directory.GetDirectories(e.Node.Text))
                    {
                        AddDirectoryToFileTree(directory, includeSubDirectoriesCheckBox.Checked, e.Node);
                    }
                }
                catch (UnauthorizedAccessException)
                {
                    TreeNode unauthNode = new TreeNode("Access denied....") { ImageIndex = 2, SelectedImageIndex = 2 };
                    e.Node.Nodes.Add(unauthNode);
                }

            }
        }

    }

    /// <summary>
    /// Used to sort the tree view nodes based on the underlying domain object type
    /// </summary>
    public class PermissionTreeNodeSorter : IComparer
    {
        // Compare the length of the strings, or the strings
        // themselves, if they are the same length.
        public int Compare(object x, object y)
        {
            // If the node types are PermissionTreeNode compare on Type property
            if (x is PermissionTreeNode px && y is PermissionTreeNode py)
            {
                if (px.Type != py.Type)
                {
                    return px.Type - py.Type;
                }

                return string.CompareOrdinal(px.Text.ToUpper(), py.Text.ToUpper());
            }
            // TODO: Add in check to ensure root nodes appear before unknown sid nodes

            // If not PermissionTreeNode then compare as normal node on image index and text
            TreeNodeAdv tx = x as TreeNodeAdv;
            TreeNodeAdv ty = y as TreeNodeAdv;

            if (tx.LeftImage != ty.LeftImage && tx.LeftImageIndices.Length > 0 && ty.LeftImageIndices.Length > 0)
            {
                return tx.LeftImageIndices[0] - ty.LeftImageIndices[0];
            }

            return string.CompareOrdinal(tx.Text.ToUpper(), ty.Text.ToUpper());
        }
    }

    /// <inheritdoc />
    /// <summary>
    /// Extended class used to hold additional information relating to the underlying domain object
    /// </summary>
    public class PermissionTreeNode : TreeNodeAdv
    {
        public string Name { get; set; }
        public string Sid { get; set; }
        public DomainObjectType Type { get; set; }
        public string Rights { get; set; }
        public string SamAccountName { get; set; }
        public string Domain { get; set; }
        public string OrganizationalUnit { get; set; }
        public bool Inherited { get; set; }

        public PermissionTreeNode(string name, string rights = null, bool inherited = false)
        {
            Name = name;
            Text = name;
            LeftImageIndices = new int[] { (int)Type };
            Rights = rights;
            Inherited = inherited;
        }

        public PermissionTreeNode(DomainObject domainObject, string rights = null, bool inherited = false) : base()
        {
            Name = domainObject.Name;
            Type = domainObject.Type;
            Sid = domainObject.Sid;
            LeftImageIndices = new int[] { (int)Type };
            Rights = rights;
            SamAccountName = domainObject.SamAccountName;
            Domain = domainObject.VirtualPath.DomainComponent.ToLower();
            OrganizationalUnit = domainObject.VirtualPath.OrganizationalUnit;
            Inherited = inherited;
            Text = Name;

            PopulateSubItems(Inherited);
        }

        private void PopulateSubItems(bool inherited)
        {
            SubItems.Add(new TreeNodeAdvSubItem(Rights));
            SubItems.Add(new TreeNodeAdvSubItem(SamAccountName));
            SubItems.Add(new TreeNodeAdvSubItem(OrganizationalUnit));

            if (inherited)
            {
                foreach (TreeNodeAdvSubItem item in SubItems)
                {
                    item.Font = new Font(item.Font, FontStyle.Italic);
                }
            }
        }
    }
}
```